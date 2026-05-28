package pl.edu.pwr.tkubik.ism.aspect.annotation;

import java.lang.annotation.*;

/**
 * Marks a method for execution-time monitoring by {@link pl.edu.pwr.tkubik.ism.aspect.PerformanceAspect}.
 * Applied to heavy JDBC/analytics methods where slow-query alerting matters.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Timed {
}
