import { utils } from 'web3';

/**
 * Shorten an Ethereum address. `charsLength` allows to change the number of
 * characters on both sides of the ellipsis.
 *
 * Examples:
 *   shortenAddress('0x19731977931271')    // 0x1973…1271
 *   shortenAddress('0x19731977931271', 2) // 0x19…71
 *   shortenAddress('0x197319')            // 0x197319 (already short enough)
 *
 * @param {string} address The address to shorten
 * @param {number} [charsLength=4] The number of characters to change on both sides of the ellipsis
 * @returns {string} The shortened address
 */
 export function shortenAddress(address, charsLength = 4) {
  const prefixLength = 2; // "0x"
  if (!address) {
    return '';
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address;
  }
  return address.slice(0, charsLength + prefixLength) + '…' + address.slice(-charsLength);
}

export const combineBids = async (consultations, bids) => {
  const combinedBids = [];
  consultations.forEach((consultation) => {
    const combinedBid = {
      project_name: consultation.project_name,
      created: consultation.created,
      airtable_id: consultation.id,
      bid_id: null,
      amount: '0',
      submitter: '',
      bidCreated: '0',
      createTxHash: '',
      changes: [],
    }
    const openBids = bids.filter(bid => bid.status !== 'canceled' && bid.status !== 'accepted');
    openBids.forEach((bid) => {
      let airtableId = utils.hexToAscii(bid.details);
      airtableId =  airtableId.replace(/\0.*$/g,'');
      const changes = [...bid.withdraws, ...bid.increases];
      const updatedChanges = changes.map(change => {
        if (change.withdrawnAt) {
          const updatedChange = change;
          updatedChange.changedAt = change.withdrawnAt;
          return updatedChange;
        } else {
          const updatedChange = change;
          updatedChange.changedAt = change.increasedAt;
          return updatedChange;
        }
      });

      updatedChanges.sort(function(a,b){
        return new Date(Number(b.changedAt)) - new Date(Number(a.changedAt));
      });
      if (consultation.id === airtableId) {
        combinedBid.bid_id = utils.hexToNumber(bid.id.replace('0x3a9f3147742e51efba1f04ff26e8dc95978dccb4-', ''));
        combinedBid.amount = bid.amount;
        combinedBid.submitter = utils.toChecksumAddress(bid.submitter.id);
        combinedBid.bidCreated = bid.createdAt;
        combinedBid.createTxHash = bid.createTxHash;
        combinedBid.changes = [...combinedBid.changes, ...updatedChanges];
        combinedBid.status = bid.status;
      }
    })

    combinedBids.push(combinedBid);
  })

  return combinedBids;
}
