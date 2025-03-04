import {omit} from 'lodash'
import {versionedClient} from '../../../../client/versionedClient'
import {OperationArgs} from '../../types'
import {getDraftId} from '../../../../util/draftUtils'
import {isLiveEditEnabled} from '../utils/isLiveEditEnabled'

const omitProps = ['_createdAt', '_updatedAt']

export const duplicate = {
  disabled: ({snapshots}: OperationArgs) => {
    return snapshots.published || snapshots.draft ? false : 'NOTHING_TO_DUPLICATE'
  },
  execute: ({snapshots, typeName}: OperationArgs, dupeId) => {
    const source = snapshots.draft || snapshots.published
    return versionedClient.create({
      ...omit(source, omitProps),
      _id: isLiveEditEnabled(typeName) ? dupeId : getDraftId(dupeId),
      _type: source._type,
    })
  },
}
