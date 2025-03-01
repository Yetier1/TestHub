package org.dromara.testhub.sdk.model.rule;

import com.alibaba.fastjson.JSONObject;
import com.goddess.nsrule.core.executer.context.Context;
import com.goddess.nsrule.core.executer.mode.base.action.Action;
import com.goddess.nsrule.core.executer.mode.base.action.Execute;
import com.goddess.nsrule.core.executer.mode.base.action.RunState;
import org.dromara.testhub.sdk.Plugin;
import org.dromara.testhub.sdk.PluginFactory;
import lombok.Data;

@Data
public class TestHubAction extends Action {
    public TestHubAction() {
    }

    public TestHubAction(Action action) {
        super();
        super.setId(action.getId());
        super.setCode(action.getCode());
        super.setName(action.getName());
        super.setRemark(action.getRemark());
        super.setParams(action.getParams());
        super.setMappings(action.getMappings());
        super.setDataType(action.getDataType());
        super.setComplex(action.getComplex());
    }

    private String type;


    @Override
    public void extend(Context decisionContext, JSONObject data, Execute execute, RunState.Item runState) throws Exception {
        Plugin plugin = PluginFactory.getHandler(type);
        plugin.execute(decisionContext, this, (TestHubExecute) execute, data, runState);
    }

}
