import React from "react";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "../../common/Paging";
import {Client} from "../../../services/api";
import {AddressLink, TransactionHashLink} from "../../common/Links";
import {TRXPrice} from "../../common/Price";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime, injectIntl} from "react-intl";
import {ONE_TRX} from "../../../constants";
import {tu} from "../../../utils/i18n";
import TimeAgo from "react-timeago";
import {Truncate} from "../../common/text";
import {withTimers} from "../../../utils/timing";

class TokenInfo extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    let token = this.props.token;
    return (

        <table className="table m-0 tokenDetail">
          <tbody>
          <tr>
            <th style={{borderTop:'0px'}}>{tu("start_date")}:</th>
            <td style={{borderTop:'0px'}}>
              <FormattedDate value={token.startTime}/>{' '}
              <FormattedTime value={token.startTime}/>
            </td>
          </tr>
          <tr>
            <th>{tu("end_date")}:</th>
            <td>
              <FormattedDate value={token.endTime}/>{' '}
              <FormattedTime value={token.endTime}/>
            </td>
          </tr>
          <tr>
            <th>{tu("price")}:</th>
            <td>
              <FormattedNumber value={token.price / ONE_TRX}/> TRX
            </td>
          </tr>
          <tr>
            <th>{tu("progress")}:</th>
            <td>
              <FormattedNumber value={token.percentage}/> %
            </td>
          </tr>
          <tr>
            <th>{tu("total_supply")}:</th>
            <td>
              <FormattedNumber value={token.totalSupply}/> %
            </td>
          </tr>
          <tr>
            <th>{tu("issued")}:</th>
            <td>
              <FormattedNumber value={token.issued}/> %
            </td>
          </tr>
          <tr>
            <th>{tu("共筹集资金")}:</th>
            <td>
              <FormattedNumber value={token.issued * token.price / ONE_TRX}/> TRX
            </td>
          </tr>
          <tr>
            <th>{tu("国家")}:</th>
            <td>
              {"中国"}
            </td>
          </tr>

          </tbody>
        </table>

    )
  }
}

export default withTimers(TokenInfo);