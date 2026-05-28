package pl.edu.pwr.tkubik.ism.statistics;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import pl.edu.pwr.tkubik.ism.model.BuildList;

@Aspect
@Component
public class StatisticsAspect {

    @Autowired
    private StatisticsStore store;

    @Pointcut("execution(public * pl.edu.pwr.tkubik.ism.api.*.*(..)) && "
            + "!within(pl.edu.pwr.tkubik.ism.api.StatisticsController) && "
            + "!within(pl.edu.pwr.tkubik.ism.api.AnalyticsController) && "
            + "!within(pl.edu.pwr.tkubik.ism.api.SystemController)")
    public void anyControllerMethod() {}

    @AfterReturning(pointcut = "anyControllerMethod()", returning = "result")
    public void afterReturning(JoinPoint jp, Object result) {
        store.recordEndpointCall(jp.getSignature().getName());

        if (result instanceof ResponseEntity<?> responseEntity
                && responseEntity.getBody() instanceof BuildList buildList
                && buildList.getItems() != null
                && !buildList.getItems().isEmpty()) {
            store.recordBuildListData(buildList.getItems());
        }
    }
}
