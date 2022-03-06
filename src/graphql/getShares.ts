import gql from 'fake-tag';

import { MOLOCH_CLIENT } from './client';

export const memberQuery = gql`
  query MolochMembersQuery($accountAddress: String, $molochAddress: String) {
    rgMembers: members(
      where: { memberAddress: $accountAddress, molochAddress: $molochAddress }
    ) {
      molochAddress
      shares
    }
  }
`;

export const getShares = async (
  accountAddress: string,
  molochAddress: string,
): Promise<{ molochAddress: string; shares: string }> => {
  try {
    const { data, error } = await MOLOCH_CLIENT.query(memberQuery, {
      accountAddress,
      molochAddress,
    }).toPromise();
    if (error) {
      return {
        molochAddress: '0x',
        shares: '0',
      };
    }
    const member = data.rgMembers[0];
    if (!member) {
      return {
        molochAddress: '0x',
        shares: '0',
      };
    }

    const memberShares = member.shares;
    if (memberShares) {
      return {
        molochAddress: member.molochAddress,
        shares: memberShares.toString(),
      };
    }
    return {
      molochAddress: '0x',
      shares: '0',
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {
      molochAddress: '0x',
      shares: '0',
    };
  }
};
