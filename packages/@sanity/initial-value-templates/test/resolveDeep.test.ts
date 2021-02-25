import {getDefaultSchema} from '../src/parts/Schema' // mocked to test/mocks/schema.js
import {resolveInitialValue} from '../src'
import T from '../src/builder'

function generateNestedObjectTest(
  obj: Record<string, any>,
  maxDepth: number,
  depth?: number
): Record<string, any> {
  depth = depth || 1

  if (depth >= maxDepth) return obj

  depth++
  return {
    ...obj,
    child: generateNestedObjectTest(obj, maxDepth, depth),
  }
}

describe('resolveDeepInitialValues', () => {
  test('resolves deep, recursive default values', async () => {
    const defaultTemplates = T.defaults(getDefaultSchema()).map((tpl) => tpl.serialize())
    const developerTemplate = defaultTemplates.find((tpl) => tpl.id === 'developer')
    if (!developerTemplate) {
      throw new Error('Could not find developer template')
    }

    const initialValue = await resolveInitialValue(developerTemplate)

    expect(initialValue).toMatchObject({
      name: 'A default name!',
      numberOfCats: undefined,
      heroImage: {
        _type: 'captionedImage',
        caption: 'Default caption!',
      },
      recursive: generateNestedObjectTest(
        {
          _type: 'recursiveObject',
          name: '∞ recursion is ∞',
        },
        7
      ),
    })
  })

  test('resolves deep primitive type with initial value in field', async () => {
    const defaultTemplates = T.defaults(getDefaultSchema()).map((tpl) => tpl.serialize())
    const personTemplate = defaultTemplates.find((tpl) => tpl.id === 'person')
    if (!personTemplate) {
      throw new Error('Could not find person template')
    }

    const initialValue = await resolveInitialValue(personTemplate)
    expect(initialValue).toMatchObject({
      address: {
        _type: 'address',
        street: 'one old street',
        streetNo: '123',
      },
    })
  })

  test('resolves deep primitive type and overrides child initial value in field by parents', async () => {
    const defaultTemplates = T.defaults(getDefaultSchema()).map((tpl) => tpl.serialize())
    const personTemplate = defaultTemplates.find((tpl) => tpl.id === 'person')
    if (!personTemplate) {
      throw new Error('Could not find person template')
    }

    const initialValue = await resolveInitialValue({
      ...personTemplate,
      value: {
        ...personTemplate.value,
        address: {
          _type: 'address',
          street: 'one new street',
        },
      },
    })

    expect(initialValue).toMatchObject({
      address: {
        _type: 'address',
        street: 'one new street',
        streetNo: '123',
      },
    })
  })

  test('resolves deep primitive type and skip child values when parent is undefined', async () => {
    const defaultTemplates = T.defaults(getDefaultSchema()).map((tpl) => tpl.serialize())
    const personTemplate = defaultTemplates.find((tpl) => tpl.id === 'person')
    if (!personTemplate) {
      throw new Error('Could not find person template')
    }

    const initialValue = await resolveInitialValue({
      ...personTemplate,
      value: {
        ...personTemplate.value,
        address: undefined,
      },
    })

    expect(initialValue).toMatchObject({
      address: undefined,
    })
  })

  test('resolves deep primitive type and remove initial values with just _type specified', async () => {
    const defaultTemplates = T.defaults(getDefaultSchema()).map((tpl) => tpl.serialize())
    const personTemplate = defaultTemplates.find((tpl) => tpl.id === 'person')
    if (!personTemplate) {
      throw new Error('Could not find person template')
    }

    const initialValue = await resolveInitialValue({
      ...personTemplate,
      value: {
        ...personTemplate.value,
        contact: {
          _type: 'contact',
        },
      },
    })

    expect(initialValue).toMatchObject({
      address: {
        _type: 'address',
        street: 'one old street',
        streetNo: '123',
      },
    })
  })
})
