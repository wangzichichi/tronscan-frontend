/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu, t} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import { Switch } from 'antd';
import _, {find, round, filter } from "lodash";


import TokenBalanceSelect from "../../common/TokenBalanceSelect";

@injectIntl
export default class DeployModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            feeLimit:1000000000,
            userfeepercentage:0,
            originEnergyLimit:10000000,
            sendTokenAmount:0,
            constructorParams:[],
            params:[],
            params_aa:''
        };
    }

    componentDidMount() {
        this.init()
    }

    init = () => {
        let {contractNameList} = this.props;
        this.setState({
            currentContractName : contractNameList[0]
        },()=>{
            this.getConstructorParams(contractNameList[0]);
        });
    }

    hideModal = () => {
        let {onHide} = this.props;
        onHide && onHide();
    };

    Mul (arg1, arg2) {
        let r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
        m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
        resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
        return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
    }

    confirmModal = () => {
        let { currentContractName, feeLimit, userfeepercentage, originEnergyLimit, constructorParams, currentContractABI, currentContractByteCode,sendTokenId, sendTokenAmount,sendTokenDecimals,params } = this.state;
        let { onConfirm } = this.props;
        let optionsPayable = {};
         sendTokenId = 0;
        if (!sendTokenId || sendTokenId == 0) {
            optionsPayable = { callValue: sendTokenAmount };
        } else {
            optionsPayable = {
                tokenId: sendTokenId,
                tokenValue:  this.Mul(sendTokenAmount,Math.pow(10, sendTokenDecimals))
            };
        }
        let parameters = [];
        for(let i in constructorParams) {
            parameters.push(constructorParams[i].value)
        }

        console.log('parameters222',params)
        let form = {
            abi:currentContractABI,
            bytecode:currentContractByteCode,
            feeLimit: feeLimit,
            name: currentContractName,
            originEnergyLimit: originEnergyLimit,
            parameters: params,
            userFeePercentage: userfeepercentage,
            ...optionsPayable
        }
        console.log('form22222222======',form)
        onConfirm && onConfirm(form);
    };

    resourceSelectChange = (value) => {
        console.log('value',value)
        this.setState({
            currentContractName : value
        },()=>{
            this.getConstructorParams(value);
        });

    };

    handleToggle = (prop,value) => {
        this.setState({ [prop]: value });
    };

    setParams = (value) => {
        let ConstructorParams = [];
        ConstructorParams.push(value);
        this.setState({
            params : ConstructorParams
        });
    };

    tokenBalanceSelectChange(name, decimals, balance){
        this.setState({
            sendTokenId:name,
            sendTokenDecimals:decimals,
            sendTokenBalance:balance
        });
    }

    getConstructorParams = (currentContractName) =>{
        let constructorParams = [];
        let { compileInfo } = this.props;
        let currentContract = _(compileInfo)
            .filter(tb => tb.contractName == currentContractName)
            .value();
        let currentContractABI = currentContract[0].abi;
        let currentContractByteCode = currentContract[0].byteCode;
        currentContractABI && currentContractABI.map((item,index) => {
            if(item.type === 'constructor'){
                if(item.inputs){
                    constructorParams.push.apply(constructorParams,item.inputs)
                }
                console.log('constructorParams============',constructorParams)
            }
        });
        constructorParams && constructorParams.map((item,i) => {
            item.value = ''
        });
        this.setState({
            constructorParams,
            currentContractABI,
            currentContractByteCode
        });

    };






    render() {
        let { currentContractName, feeLimit, userfeepercentage, originEnergyLimit, sendTokenAmount,constructorParams,params,params_aa} = this.state;
        let { contractNameList, intl } = this.props;
        console.log('contractNameList',contractNameList);
        return (
            <Modal isOpen={true}  fade={false} className="modal-dialog-centered _freezeContent">
               <ModalHeader className="text-center _freezeHeader" toggle={this.hideModal}>
                   {tu("Deploy Params")}
               </ModalHeader>
               <ModalBody className="_freezeBody">
                   <div className="form-group">
                       <p>Contract deployment will cost a certain amount of trx or energy</p>
                   </div>
                   <div className="form-group contract-deploy">
                       <label>{tu("合约名称")}</label>
                       <select className="custom-select deploy-select"
                               value={currentContractName}
                               onChange={(e) => {this.resourceSelectChange(e.target.value)}}>
                           {
                               contractNameList.map((resource, index) => {
                                   return (
                                       <option key={index} value={resource}>{intl.formatMessage({id: resource})}</option>
                                   )
                               })
                           }
                       </select>
                   </div>
                   <div className="form-group contract-deploy">
                       <label>{tu("Fee Limit")}</label>
                       <input type="text"
                              onChange={(ev) => this.handleToggle('feeLimit', ev.target.value)}
                              className="form-control deploy-input"
                              value={ feeLimit }
                       />
                   </div>

                   <div className="form-group contract-deploy">
                       <label>{tu("User Fee Percentage")}</label>
                       <input type="text"
                              onChange={(ev) => this.handleToggle('userfeepercentage', ev.target.value)}
                              className="form-control deploy-input"
                              value={ userfeepercentage }
                       />

                   </div>
                   <div className="form-group contract-deploy">
                       <label>{tu("Origin Energy Limit")}</label>
                       <input type="text"
                              onChange={(ev) => this.handleToggle('originEnergyLimit', ev.target.value)}
                              className="form-control deploy-input"
                              value={originEnergyLimit}
                       />

                   </div>
                   <div className="form-group">
                       <label>{tu("Select TRX or token to send")}</label>
                       <div className="deploy-input-box">
                           <TokenBalanceSelect
                               tokenBalanceSelectChange={(name, decimals,balance) => {this.tokenBalanceSelectChange(name, decimals,balance)}}>
                           </TokenBalanceSelect>
                           <input type="text"
                                  onChange={(ev) => this.handleToggle('tokenAmount', ev.target.value)}
                                  className="form-control deploy-input ml-4 input-box-sec"
                                  value={sendTokenAmount}
                           />
                       </div>
                   </div>
                   {
                       constructorParams.length > 0 && <div className="form-group">
                           <label>{tu("Params for constructor")}</label>
                           {
                               constructorParams.map((item, index) => {
                                   return (
                                       <div className="deploy-input-box" key={index}>
                                           <input type="text"
                                                  onChange={(ev) => this.setParams(ev.target.value)}
                                                  className="form-control deploy-input"
                                                 // value={params_aa}
                                                  placeholder={item.name}
                                           />
                                           <input type="text"
                                               //onChange={(ev) => this.setAddress(ev.target.value)}
                                                  className="form-control deploy-input ml-4 input-box-sec"
                                                  value={item.type}
                                                  disabled={true}
                                           />
                                       </div>
                                   )
                               })
                           }
                       </div>
                   }
                   <div className="contract-compiler-button">
                       <button
                           onClick={this.hideModal}
                           className="compile-button-small cancel"
                       >
                           {tu('取消')}
                       </button>
                       <button
                           onClick={this.confirmModal}
                           className="compile-button-small ml-5"
                       >
                           {tu('确认')}
                       </button>
                   </div>
               </ModalBody>
           </Modal>

        )
    }
}

const styles = {
    maxButton: {
        position:'absolute',
        right:0,
        top:0,
        background:'none',
        height:'35px',
        border:'none',
        cursor:'pointer',
    }
};