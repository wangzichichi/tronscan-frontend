import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tu } from '../../utils/i18n';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

class MappingModal extends Component {

    static propTypes = {
        address: PropTypes.string.isRequired,
        currency: PropTypes.string.isRequired,
        sideChains: PropTypes.array,
        account: PropTypes.object,
    };

    constructor() {
        super();

        this.state = {
            name: '',
            disabled: false,
        };
    }

    /**
     * Form validation
     */
    isValid = () => {
        let { name } = this.state;

        if (name.length < 8) {
            return [false, tu('name_to_short')];
        }

        if (name.length > 32) {
            return [false, tu('name_to_long')];
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
            return [false, tu('permitted_characters_message')];
        }

        return [true];
    };

    /**
     * Form confirm
     */
    confirm = () => {
        const { form: { validateFields }, account: { sunWeb }, onCancel,
            option: { address } } = this.props;

        this.setState({ disabled: true });

        validateFields(async(err, values) => {
            if (!err) {
                const data = await sunWeb.mappingTrc20(address, 0, 10000);
                onCancel();
            }
        });
    };

    /**
     * Form cancel
     */
    cancel = () => {
        const { onCancel } = this.props;
        onCancel && onCancel();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { currency, sideChains } = this.props;
        const isHasSideChainsData = sideChains && sideChains.length > 0;

        // mappingTextItem
        const mappingTextItem = (
            <div className="mb-4">
                <span>{tu('main_account_mapping_desc1')}</span><br />
                <span>{tu('main_account_mapping_desc2')}</span>
            </div>
        );

        // currencyItem
        const currencyItem = (
            <Form.Item label={tu('pledge_currency')}>
                {getFieldDecorator('currency', {
                    initialValue: currency
                })(<Input disabled />)}
            </Form.Item>
        );

        // sidechainItem
        const sideChainItem = (
            <Form.Item label={tu('pledge_sidechain')}>
                {getFieldDecorator('sidechain', {
                    initialValue: isHasSideChainsData && sideChains[0].gatewayAddress,
                })(<Select>
                    {sideChains.map(v => (<Option key={v.gatewayAddress} value={v.gatewayAddress}>{v.name}</Option>))}
                </Select>)}
            </Form.Item>
        );

        // btnItem
        const btnItem = (
            <button className="btn btn-danger mt-4 mb-3" style={{ width: '100%' }}
                onClick={this.confirm}>{tu('main_account_mapping_btn')}</button>
        );

        return (
            <Modal
                title={tu('main_account_mapping_btn')}
                visible={true}
                onCancel={this.cancel}
                footer={null}
            >
                <Form onSubmit={this.handleSubmit}>
                    {mappingTextItem}
                    {currencyItem}
                    {sideChainItem}
                    {btnItem}
                </Form>
            </Modal>
        );
    }
}

function mapStateToProps(state, ownProp) {
    return {
        address: ownProp.address,
        currency: ownProp.currency,
        sideChains: state.app.sideChains,
        account: state.app.account,
    };
}

const mapDispatchToProps = {};

export default Form.create({ name: 'mapping' })(connect(mapStateToProps, mapDispatchToProps)(MappingModal));