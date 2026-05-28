package pl.edu.pwr.tkubik.ism.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Cross-cutting service-layer logger.
 *
 * Advice types demonstrated:
 *   @Before         — logs method entry (name + arg count).
 *   @AfterReturning — logs clean return.
 *   @AfterThrowing  — logs exception class + message without swallowing it.
 *
 * Pointcut targets all public methods of every *Impl class in the service
 * package, keeping analytics (no Impl suffix) and controllers out of scope.
 */
@Aspect
@Component
public class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    @Pointcut("execution(public * pl.edu.pwr.tkubik.ism.service.*Impl.*(..))")
    public void serviceLayer() {}

    @Before("serviceLayer()")
    public void logEntry(JoinPoint jp) {
        log.debug("[AOP] → {}.{}() args={}",
                jp.getTarget().getClass().getSimpleName(),
                jp.getSignature().getName(),
                jp.getArgs().length);
    }

    @AfterReturning("serviceLayer()")
    public void logExit(JoinPoint jp) {
        log.debug("[AOP] ← {}.{}() OK",
                jp.getTarget().getClass().getSimpleName(),
                jp.getSignature().getName());
    }

    @AfterThrowing(pointcut = "serviceLayer()", throwing = "ex")
    public void logException(JoinPoint jp, Throwable ex) {
        log.warn("[AOP] ✗ {}.{}() threw {}: {}",
                jp.getTarget().getClass().getSimpleName(),
                jp.getSignature().getName(),
                ex.getClass().getSimpleName(),
                ex.getMessage());
    }
}
