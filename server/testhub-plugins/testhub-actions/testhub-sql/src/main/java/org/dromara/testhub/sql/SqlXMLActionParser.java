package org.dromara.testhub.sql;

import com.goddess.nsrule.core.constant.RuleException;
import com.goddess.nsrule.core.executer.mode.base.bound.FreeMarker;
import com.goddess.nsrule.core.parser.BoundParser;
import com.goddess.nsrule.core.parser.BoundParserFreeMarker;
import org.dromara.testhub.sdk.BaseXMLActionParser;
import org.dromara.testhub.sdk.model.rule.TestHubAction;
import org.dromara.testhub.sql.model.TestHubActionSql;
import org.dom4j.Element;
import org.dom4j.tree.AbstractNode;

public class SqlXMLActionParser implements BaseXMLActionParser {
    private static BoundParser<String, FreeMarker> boundParser = new BoundParserFreeMarker();
    @Override
    public TestHubAction xml2Model(Element element, TestHubAction action) {
        TestHubActionSql actionSql = new TestHubActionSql(action);
        Element bound = element.element("bound");
        if(bound==null){
            throw new RuleException(action.getCode()+"必须包含bound");
        }
        StringBuilder template = new StringBuilder();
        for (Object node : bound.content()) {
            int type = ((AbstractNode) node).getNodeType();
            if (type == 3 || type == 4) {
                //Text //CDATA
                String text = ((AbstractNode) node).getText();
                template.append(text);
            } else if (type == 1) {
                throw new RuleException("bound中仅支持Text和CDATA");
            }
        }
        actionSql.setBound(boundParser.parser(template.toString()));
        String text = bound.asXML();
        text =text.replace("<bound>","");
        text =text.replace("</bound>","");
        text =text.replace("<![CDATA[","");
        text =text.replace("]]>","");
        actionSql.setText(text);
        return actionSql;
    }


    @Override
    public Element model2xml(Element element, TestHubAction action) {
        return element;
    }
}
