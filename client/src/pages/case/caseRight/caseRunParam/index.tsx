// 主要处理新建和编辑的场景

import type { ProFormInstance } from '@ant-design/pro-components';
import {
    ProFormCheckbox,
    ProFormDateRangePicker,
    ProFormDigit,
    ProFormSelect,
    ProFormText,
    StepsForm,
} from '@ant-design/pro-components';
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Select, Steps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { ExecutionXmlReqDto, RuleEnvironmentResDto, RuleFlowResDto, RuleParamResDto, RuleProjectResDto, RuleResDto } from '@/typings';
import { DefaultOptionType } from 'antd/lib/select';
import { CheckboxOptionType } from 'antd/es/checkbox';
import i18n from '@/i18n';
const { Step } = Steps;


interface IProps {
    rule: RuleResDto,
    project: RuleProjectResDto,
    executionXmlInfo?: ExecutionXmlReqDto,
}

const getEnvs = (environments: RuleEnvironmentResDto[] | undefined) => {
    const envs: DefaultOptionType[] = [];
    environments?.map((environment: RuleEnvironmentResDto, index: number) => {
        envs.push({ value: environment.code, label: environment.name || environment.code });
    });
    return envs;
}
const getFlows = (flows: RuleFlowResDto[] | undefined) => {
    const res: CheckboxOptionType[] = [];
    flows?.map((flow: RuleFlowResDto, index: number) => {
        res.push({ value: flow.code, label: flow.name || flow.code });
    });
    return res;
}

const CaseRunParam = forwardRef((props: IProps, ref) => {
    const [executionXmlInfo, setExecutionXmlInfo] = useState<ExecutionXmlReqDto>(props.executionXmlInfo || { project: props.project.code, params: new Map(), flows: [] });
    const [current, setCurrent] = useState(0);
    const formMapRef = useRef<
        React.MutableRefObject<ProFormInstance<any> | undefined>[]
    >([]);
    const [loading, setLoading] = useState(false);
    useImperativeHandle(ref, () => ({
        getData: async () => {
            let flag = true;
            const validatePromises = (formMapRef.current || []).map(async (item, i) => {
                await item.current?.validateFields().catch(() => {
                    setCurrent(i);
                    flag = false;
                });
            });
            await Promise.all(validatePromises);
            return { flag: flag, data: executionXmlInfo };
        },
    }));
    useEffect(() => {
        setLoading(true);
    }, [executionXmlInfo]);

    useEffect(() => {
        const temp = executionXmlInfo;
        props.rule.params?.map((item) => {
            if (!temp.params) {
                temp.params = new Map();
            }
            temp.params.set(item.code, item.data);
        })
        temp.flows = [];
        props.rule.flows?.map((flow: RuleFlowResDto, index: number) => {
            temp.flows?.push(flow.code);
        })
        // temp.envCode = "default";
        setExecutionXmlInfo({ ...temp });
    }, []);

    const setParams = (key: string, val: any) => {
        const temp = executionXmlInfo;
        if (temp.params) {
            temp.params.set(key, val)
        } else {
            temp.params = { key: val };
        }
        setExecutionXmlInfo({ ...temp });
    };
    const setFlows = (vals: CheckboxValueType[]) => {
        const temp = executionXmlInfo;
        temp.flows = [];
        vals?.map((val: CheckboxValueType, index: number) => {
            temp.flows?.push(val.toString());
        })
        setExecutionXmlInfo({ ...temp });
    };
    const inits = () => {
        const res: React.JSX.Element[] = []
        props.rule.params?.map((item) => {
            if (item.dataType == 'NUMBER') {
                res.push(<ProFormDigit
                    key={item.code}
                    name={item.code}
                    label={item.name || item.code}
                    labelCol={{ span: 4 }} // 设置 label 标签占据整个宽度
                    wrapperCol={{ span: 20 }} // 设置文本框占据整个宽度
                    placeholder={executionXmlInfo.params.get(item.code)}
                    rules={[{ required: item.necessary, message: (item.name || item.code) + i18n('case.label.notNull') }]}
                    fieldProps={{
                        stringMode: true,
                        step: "0.0001",
                        onChange: (value) => setParams(item.code, value)
                    }}
                />);
            } else {
                res.push(<ProFormText
                    key={item.code}
                    name={item.code}
                    label={item.name || item.code}
                    labelCol={{ span: 4 }} // 设置 label 标签占据整个宽度
                    wrapperCol={{ span: 20 }} // 设置文本框占据整个宽度
                    placeholder={executionXmlInfo.params.get(item.code)}
                    rules={[{ required: item.necessary, message: (item.name || item.code) + i18n('case.label.notNull') }]}
                    fieldProps={{
                        onChange: (e) => setParams(item.code, e.target.value)
                    }}
                />);
            }
        })
        return res;
    }

    return (
        <>
            {
                loading && (
                    <StepsForm
                        formMapRef={formMapRef}
                        current={current}
                        onFinish={(values) => {
                            return Promise.resolve(true);
                        }}
                        stepsRender={(steps: {
                            key: string;
                            title?: React.ReactNode;
                        }[], defaultDom: React.ReactNode) => {
                            return <Steps current={current} size={'small'} onChange={(index: number) => { setCurrent(index) }}>
                                {steps?.map((item) => {
                                    return (
                                        <Step key={item.key} title={item.title} />
                                    );
                                })}
                            </Steps>
                        }
                        }
                        submitter={{ render: (props) => { return []; } }}
                    >
                        {
                            (props.project.environments && props.project.environments.length > 0) &&
                            <StepsForm.StepForm name="step1" title={i18n('case.title.envSetting')} initialValues={executionXmlInfo}>
                                <ProFormSelect
                                    name={['envCode']}
                                    label={i18n('case.label.envs')}
                                    labelCol={{ span: 4 }} // 设置 label 标签占据整个宽度
                                    wrapperCol={{ span: 20 }} // 设置文本框占据整个宽度
                                    options={getEnvs(props.project.environments)}
                                />
                            </StepsForm.StepForm>
                        }

                        <StepsForm.StepForm name="step2" title={i18n('case.title.flowSetting')} onClick={() => setCurrent((props.project.environments && props.project.environments.length > 0) ? 1 : 0)} initialValues={executionXmlInfo}>
                            <ProFormCheckbox.Group
                                name={['flows']}
                                label={i18n('case.label.flows')}
                                layout="vertical"
                                labelCol={{ span: 4 }} // 设置 label 标签占据整个宽度
                                wrapperCol={{ span: 20 }} // 设置文本框占据整个宽度
                                options={getFlows(props.rule.flows)}
                                fieldProps={{
                                    onChange: (values: CheckboxValueType[]) => setFlows(values)
                                }}
                                rules={[{
                                    validator: (_, value) => {
                                        if (value && value.length === 0) {
                                            return Promise.reject(i18n('case.message.selectOne'));
                                        }
                                        return Promise.resolve();
                                    }
                                }]}
                            />
                        </StepsForm.StepForm>
                        {
                            (props.rule.params && props.rule.params.length > 0) &&
                            <StepsForm.StepForm name="step3" title={i18n('case.title.paramSetting')} onClick={() => setCurrent((props.project.environments && props.project.environments.length > 0) ? 2 : 1)} initialValues={Object.fromEntries(executionXmlInfo.params)}>
                                {inits()}
                            </StepsForm.StepForm>
                        }
                    </StepsForm >
                )
            }
        </>


    );
});
export default CaseRunParam;