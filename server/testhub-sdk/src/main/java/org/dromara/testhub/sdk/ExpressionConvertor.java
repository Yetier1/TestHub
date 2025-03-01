package org.dromara.testhub.sdk;

import org.dromara.testhub.sdk.dto.res.RuleExpressionResDto;
import com.goddess.nsrule.core.constant.Constant;
import com.goddess.nsrule.core.executer.mode.ruleLine.Expression;

import java.util.ArrayList;
import java.util.List;

public class ExpressionConvertor {
    public static RuleExpressionResDto ruleExpressionModel2Res(Expression expression) {
        if (expression == null) {
            return null;
        }
        RuleExpressionResDto resDto = new RuleExpressionResDto();
        resDto.setId(0L);
        resDto.setType(expression.getExpressionType());
        resDto.setOperation(expression.getOperationCode());
        if (Constant.ExpressionType.RELATION.equalsIgnoreCase(expression.getExpressionType())) {
            resDto.setDataType(expression.getDataType());
            resDto.setCover(expression.getCover());
            resDto.setThreshold(expression.getThreshold());
        } else {
            List<RuleExpressionResDto> subs = new ArrayList<>();
            long i = 0;
            for (Expression sub : expression.getSubExpression()) {
                RuleExpressionResDto subItem = ruleExpressionModel2Res(sub);
                subItem.setId(i);
                subs.add(subItem);
                i++;
            }
            resDto.setSubs(subs);
        }

        return resDto;
    }
}
