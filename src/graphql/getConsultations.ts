import gql from 'fake-tag';
import type { IConsultation } from 'utils/types';

import { DUNGEON_MASTER_CLIENT } from './client';

const consultationsQuery = gql`
  query ConsultationsQuery {
    consultations {
      project_name
      submission_type
      submission_hash
      consultation_hash
      createdAt
      _id
    }
  }
`;

const WHITELISTED_CONSULTATIONS: string[] = [
  '0xb8f1bbef3ff24690283011bf382a1933aef5481c6d33395d46ea47a0997339c2',
  '0xe54450ef5641d147dda005e64910ff213520805e0b318d6cb9ca52d8bf3629bb',
  '0x6be8ad1e1779f2e0fd276385c55bd73fd0c4fd950896a8bbbbafeb5920859c5b',
  '0x2f9c6aa55051a186828185e193716916afec84f834f04c6943ca15b1c96d901e',
  '0x5b63fee3eede3bdacf1b763257b7da38d512cf48d648d1bd5a901bb54a24a631',
  '0xc0936154e09f78784d7d7b613b809aab8bcf6f908467cf3df70917b9e6d52f11',
];

export const getConsultations = async (): Promise<IConsultation[]> => {
  try {
    const { data, error } = await DUNGEON_MASTER_CLIENT.query(
      consultationsQuery,
    ).toPromise();
    if (error) {
      return [];
    }
    const consultations = data.consultations;
    if (!consultations) {
      return [];
    } else {
      const filteredConsultations = consultations.filter((c: IConsultation) => {
        const paid = c.submission_type === 'Paid';
        const oldConsultation = !c?.submission_hash && !!c?.consultation_hash;
        const newConsultation = !!c?.submission_hash && !c?.consultation_hash;

        return (
          (paid && newConsultation) ||
          (paid &&
            oldConsultation &&
            WHITELISTED_CONSULTATIONS.includes(c.consultation_hash))
        );
      });
      return filteredConsultations;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return [];
  }
};
