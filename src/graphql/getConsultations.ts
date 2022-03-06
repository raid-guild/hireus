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
      const filteredConsultations = consultations.filter(
        (c: IConsultation) =>
          c.submission_type === 'Paid' &&
          c.submission_hash &&
          !c.consultation_hash,
      );
      return filteredConsultations;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return [];
  }
};
