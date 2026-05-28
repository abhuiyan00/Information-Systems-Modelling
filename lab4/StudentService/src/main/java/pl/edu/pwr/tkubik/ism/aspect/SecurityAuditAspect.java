package pl.edu.pwr.tkubik.ism.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;
import pl.edu.pwr.tkubik.ism.model.LoginRequest;

/**
 * Security audit trail via AOP — no business logic changed in controllers.
 *
 * Advice types demonstrated:
 *   @AfterReturning — inspects the ResponseEntity status to distinguish
 *                     successful from failed login attempts.
 *   @After          — fires on every admin controller call (success OR exception),
 *                     matching the "log everything" audit pattern.
 *
 * Why AOP here instead of code in the controller:
 *   Controllers implement generated OpenAPI interfaces; adding audit calls
 *   inside them couples business logic to observability. The aspect keeps
 *   controllers clean and the audit policy in one place.
 */
@Aspect
@Component
public class SecurityAuditAspect {

    private static final Logger log = LoggerFactory.getLogger(SecurityAuditAspect.class);

    @Pointcut("execution(* pl.edu.pwr.tkubik.ism.api.AuthController.authLoginPost(..))")
    public void loginEndpoint() {}

    @Pointcut("execution(* pl.edu.pwr.tkubik.ism.api.AdminController.*(..))")
    public void adminEndpoints() {}

    @AfterReturning(pointcut = "loginEndpoint()", returning = "result")
    public void auditLogin(JoinPoint jp, Object result) {
        Object[] args = jp.getArgs();
        String emailHash = (args.length > 0 && args[0] instanceof LoginRequest lr && lr.getEmail() != null)
                ? DigestUtils.md5DigestAsHex(lr.getEmail().toLowerCase().getBytes())
                : "unknown";
        int status = (result instanceof ResponseEntity<?> re)
                ? re.getStatusCode().value() : -1;
        if (status == 200) {
            log.info("[AUDIT] LOGIN success  email_hash={}", emailHash);
        } else {
            log.warn("[AUDIT] LOGIN failed   email_hash={} status={}", emailHash, status);
        }
    }

    @After("adminEndpoints()")
    public void auditAdminAction(JoinPoint jp) {
        log.info("[AUDIT] ADMIN {}.{}()",
                jp.getTarget().getClass().getSimpleName(),
                jp.getSignature().getName());
    }
}
