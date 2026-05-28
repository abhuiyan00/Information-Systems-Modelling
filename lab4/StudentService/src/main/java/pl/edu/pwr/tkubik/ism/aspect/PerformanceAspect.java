package pl.edu.pwr.tkubik.ism.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Execution-time monitor using @Around — the only advice type that can
 * wrap both pre- and post-execution logic in a single method.
 *
 * Two pointcut strategies shown:
 *   1. @annotation — targets any method annotated with @Timed (opt-in).
 *      Applied to AnalyticsService.dashboard() and .ai() which run
 *      multi-table JDBC aggregations and are the heaviest DB operations.
 *   2. Class-level execution pattern could be added here as well (commented
 *      example at the bottom) — kept separate to avoid double-firing.
 *
 * Logs WARN when execution >= SLOW_THRESHOLD_MS (500 ms); DEBUG otherwise.
 * Threshold is intentionally low for lab/dev to surface slow queries early.
 */
@Aspect
@Component
public class PerformanceAspect {

    private static final Logger log = LoggerFactory.getLogger(PerformanceAspect.class);
    private static final long SLOW_THRESHOLD_MS = 500;

    @Around("@annotation(pl.edu.pwr.tkubik.ism.aspect.annotation.Timed)")
    public Object measureTimed(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            return pjp.proceed();
        } finally {
            long ms = System.currentTimeMillis() - start;
            String cls = pjp.getTarget().getClass().getSimpleName();
            String method = pjp.getSignature().getName();
            if (ms >= SLOW_THRESHOLD_MS) {
                log.warn("[AOP] SLOW {}.{}() took {} ms (threshold {} ms)",
                        cls, method, ms, SLOW_THRESHOLD_MS);
            } else {
                log.debug("[AOP] PERF {}.{}() {} ms", cls, method, ms);
            }
        }
    }

    /*
     * Alternative: class-level pointcut (not active — would double-fire
     * for methods already caught by @Timed above):
     *
     * @Around("execution(public * pl.edu.pwr.tkubik.ism.service.AnalyticsService.*(..))")
     * public Object measureAnalytics(ProceedingJoinPoint pjp) throws Throwable { ... }
     */
}
