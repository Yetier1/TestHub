package org.dromara.testhub.sql.model;

import com.goddess.nsrule.core.executer.mode.base.bound.Bound;
import org.dromara.testhub.sdk.model.rule.TestHubAction;
import lombok.Data;

@Data
public class TestHubActionSql extends TestHubAction {

    private Bound bound;
    private String text;

    public TestHubActionSql(TestHubAction action){
        super();
        super.setId(action.getId());
        super.setCode(action.getCode());
        super.setName(action.getName());
        super.setRemark(action.getRemark());
        super.setParams(action.getParams());
        super.setMappings(action.getMappings());
        super.setDataType(action.getDataType());
        super.setComplex(action.getComplex());
        super.setType(action.getType());
    }
}
