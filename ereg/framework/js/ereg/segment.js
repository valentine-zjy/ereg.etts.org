(function initializeConsentAwareSegment(windowRef, documentRef) {
    'use strict';

    var ANALYTICS_CATEGORY = 'C0002';
    var INITIAL_POLL_INTERVAL_MS = 100;
    var INITIAL_TIMEOUT_MS = 5000;
    var RECOVERY_POLL_INTERVAL_MS = 1000;
    var EVENT_METHOD_OPTION_INDEX = {
        alias: 2,
        group: 2,
        identify: 2,
        page: 3,
        screen: 3,
        track: 2,
    };
    var analytics = (windowRef.analytics = windowRef.analytics || []);
    var consentContext = null;
    var consentStatus = 'unknown';
    var initialPollTimer;
    var recoveryPollTimer;
    var timeoutTimer;
    var segmentLoaded = false;
    var amplitudePendingIdentifies = [];
    var amplitudeReadyPollTimer;
    var amplitudeReadyPollAttempts = 0;

    if (analytics.initialize) {
        return;
    }
    if (analytics.invoked) {
        if (windowRef.console && console.error) {
            console.error('Segment snippet included twice.');
        }
        return;
    }

    function isAnalyticsGranted(context) {
        return !!(context && context.consent && context.consent.categoryPreferences[ANALYTICS_CATEGORY] === true);
    }

    function isAmplitudeReady() {
        return !!(windowRef.amplitude
            && typeof windowRef.amplitude.setUserId === 'function'
            && typeof windowRef.amplitude.identify === 'function'
            && typeof windowRef.amplitude.Identify === 'function');
    }

    function dispatchAmplitudeIdentify(userId, traits, callback, resetBeforeIdentify) {
        if (resetBeforeIdentify && typeof windowRef.amplitude.reset === 'function') {
            windowRef.amplitude.reset();
        }
        var identifyEvent = new windowRef.amplitude.Identify();
        Object.keys(traits || {}).forEach(function setUserProperty(propertyName) {
            identifyEvent.set(propertyName, traits[propertyName]);
        });
        if (userId) {
            windowRef.amplitude.setUserId(userId);
        }
        windowRef.amplitude.identify(identifyEvent);
        if (typeof callback === 'function') {
            callback(true);
        }
    }

    function flushAmplitudeIdentifies() {
        if (!isAmplitudeReady()) {
            return;
        }
        windowRef.clearInterval(amplitudeReadyPollTimer);
        amplitudeReadyPollTimer = null;
        amplitudeReadyPollAttempts = 0;
        var calls = amplitudePendingIdentifies;
        amplitudePendingIdentifies = [];
        calls.forEach(function dispatchPendingIdentify(call) {
            dispatchAmplitudeIdentify(call.userId, call.traits, call.callback, call.resetBeforeIdentify);
        });
    }

    function waitForAmplitude() {
        if (isAmplitudeReady()) {
            flushAmplitudeIdentifies();
            return;
        }
        if (amplitudeReadyPollTimer) return;
        amplitudeReadyPollTimer = windowRef.setInterval(function pollForAmplitude() {
            amplitudeReadyPollAttempts += 1;
            if (isAmplitudeReady()) {
                flushAmplitudeIdentifies();
            } else if (amplitudeReadyPollAttempts >= 50) {
                windowRef.clearInterval(amplitudeReadyPollTimer);
                amplitudeReadyPollTimer = null;
                amplitudeReadyPollAttempts = 0;
                amplitudePendingIdentifies.forEach(function rejectAmplitudeIdentify(call) {
                    if (typeof call.callback === 'function') call.callback(false);
                });
                amplitudePendingIdentifies = [];
                if (windowRef.console && console.warn) {
                    console.warn('Amplitude identify skipped: GTM did not expose the Amplitude SDK.');
                }
            }
        }, 100);
    }

    function amplitudeIdentify(userId, traits, callback, resetBeforeIdentify) {
        var normalizedUserId = userId === undefined || userId === null ? '' : String(userId).trim();
        amplitudePendingIdentifies.push({
            userId: normalizedUserId,
            traits: traits || {},
            callback: callback,
            resetBeforeIdentify: resetBeforeIdentify === true,
        });
        waitForAmplitude();
    }

    windowRef.amplitudeIdentify = amplitudeIdentify;

    function readConsentContext() {
        if (!windowRef.OneTrust || typeof windowRef.OnetrustActiveGroups !== 'string') {
            return null;
        }

        var groups;
        try {
            groups = windowRef.OneTrust.GetDomainData().Groups;
        } catch (error) {
            return null;
        }
        if (!Array.isArray(groups) || !groups.length) {
            return null;
        }

        var activeGroupIds = windowRef.OnetrustActiveGroups.split(',')
            .map(function trimGroupId(groupId) {
                return groupId.trim();
            })
            .filter(Boolean);
        var categoryPreferences = groups.reduce(function buildPreferences(preferences, group) {
            var groupId = group.CustomGroupId && group.CustomGroupId.trim();
            if (groupId) {
                preferences[groupId] = activeGroupIds.indexOf(groupId) !== -1;
            }
            return preferences;
        }, {});

        if (!Object.keys(categoryPreferences).length) {
            return null;
        }

        return {
            consent: {
                categoryPreferences: categoryPreferences,
            },
        };
    }

    function getBufferedPageContext() {
        var canonicalLink = documentRef.querySelector("link[rel='canonical']");
        return {
            __t: 'bpc',
            c: canonicalLink && canonicalLink.getAttribute('href'),
            p: windowRef.location.pathname,
            r: documentRef.referrer,
            s: windowRef.location.search,
            t: documentRef.title,
            u: windowRef.location.href,
        };
    }

    function queueSegmentCall(method, args) {
        // Consent preferences are attached as Segment context by consentMiddleware.
        analytics.push([method].concat(args, getBufferedPageContext()));
    }

    function consentMiddleware(middleware) {
        var payload = middleware.payload;
        var next = middleware.next;
        var currentContext = readConsentContext() || consentContext;
        if (currentContext) {
            payload.obj.context = payload.obj.context || {};
            payload.obj.context.consent = payload.obj.context.consent || currentContext.consent;
        }
        next(payload);
    }

    function acceptCall(call) {
        if (typeof call.acceptanceCallback === 'function') {
            call.acceptanceCallback(true);
        }
    }

    function loadSegment() {
        if (segmentLoaded) {
            return;
        }
        segmentLoaded = true;

        analytics.push(['addSourceMiddleware', consentMiddleware]);
        analytics.load(segmentWriteKey);
    }

    function publishConsent() {
        var nextContext = readConsentContext();
        if (!nextContext) {
            return false;
        }

        consentContext = nextContext;
        consentStatus = 'ready';
        stopPolling();
        loadSegment();
        waitForAmplitude();
        return true;
    }

    function stopPolling() {
        windowRef.clearInterval(initialPollTimer);
        windowRef.clearInterval(recoveryPollTimer);
        windowRef.clearTimeout(timeoutTimer);
    }

    function handleConsentUpdate() {
        publishConsent();
    }

    analytics.invoked = true;
    analytics.methods = [
        'trackSubmit',
        'trackClick',
        'trackLink',
        'trackForm',
        'pageview',
        'identify',
        'reset',
        'group',
        'track',
        'ready',
        'alias',
        'debug',
        'page',
        'screen',
        'once',
        'off',
        'on',
        'addSourceMiddleware',
        'addIntegrationMiddleware',
        'setAnonymousId',
        'addDestinationMiddleware',
        'register',
    ];
    analytics.factory = function createMethod(method) {
        return function consentAwareMethod() {
            var args = Array.prototype.slice.call(arguments);
            if (EVENT_METHOD_OPTION_INDEX[method] !== undefined) {
                queueSegmentCall(method, args);
                return;
            }
            analytics.push([method].concat(args));
        };
    };
    for (var methodIndex = 0; methodIndex < analytics.methods.length; methodIndex++) {
        var method = analytics.methods[methodIndex];
        analytics[method] = analytics.factory(method);
    }
    if (!windowRef.segment) {
        windowRef.segment = {};
        analytics.methods.forEach(function addCompatibilityMethod(methodName) {
            windowRef.segment[methodName] = function delegateToConsentAwareAnalytics() {
                return windowRef.analytics[methodName].apply(windowRef.analytics, arguments);
            };
        });
    }
    analytics.load = function load(writeKey, options) {
        var script = documentRef.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.setAttribute('data-global-segment-analytics-key', 'analytics');
        script.src = segmentUrl + writeKey + '/analytics.min.js';
        script.addEventListener('error', function reportSegmentLoadError() {
            if (windowRef.console && console.error) {
                console.error('Failed to load Segment: ' + script.src);
            }
        });
        var firstScript = documentRef.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(script, firstScript);
        analytics._loadOptions = options;
    };
    analytics._writeKey = segmentWriteKey;
    analytics.SNIPPET_VERSION = '5.2.0';
    windowRef.segmentConsent = {
        getContext: function getContext() {
            return consentContext;
        },
        getStatus: function getStatus() {
            return consentStatus;
        },
        isAnalyticsGranted: function analyticsGranted() {
            return isAnalyticsGranted(consentContext);
        },
        identify: function consentAwareIdentify(userId, traits, callback) {
            var call = {
                method: 'identify',
                args: [userId, traits, {}],
                acceptanceCallback: callback,
            };
            queueSegmentCall(call.method, call.args);
            acceptCall(call);
        },
        reset: function consentAwareReset() {
            windowRef.analytics.reset();
        },
    };

    windowRef.addEventListener('OneTrustGroupsUpdated', handleConsentUpdate);
    loadSegment();
    if (!publishConsent()) {
        initialPollTimer = windowRef.setInterval(handleConsentUpdate, INITIAL_POLL_INTERVAL_MS);
        timeoutTimer = windowRef.setTimeout(function markConsentUnavailable() {
            windowRef.clearInterval(initialPollTimer);
            consentStatus = 'unavailable';
            // Fail open so a OneTrust outage does not black out analytics (aligned with toefl-ibt-ui).
            loadSegment();
            waitForAmplitude();
            recoveryPollTimer = windowRef.setInterval(handleConsentUpdate, RECOVERY_POLL_INTERVAL_MS);
        }, INITIAL_TIMEOUT_MS);
    }
})(window, document);
