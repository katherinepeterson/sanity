import React, {PropTypes} from 'react'
import FormBuilderPropTypes from '../../FormBuilderPropTypes'
import equals from 'shallow-equals'
import {getFieldType} from '../../utils/getFieldType'
import FallbackPreviewComponent from '../Array/FallbackPreviewComponent'

export default class ItemPreview extends React.Component {

  static propTypes = {
    field: FormBuilderPropTypes.field.isRequired,
    index: PropTypes.number.isRequired,
    value: PropTypes.any
  };

  static contextTypes = {
    formBuilder: PropTypes.object
  };

  shouldComponentUpdate(nextProps) {
    return !equals(nextProps, this.props)
  }

  getFieldType(field) {
    return getFieldType(this.context.formBuilder.schema, field)
  }


  render() {
    const {value, field} = this.props

    const fieldType = this.getFieldType(field)

    const PreviewComponent = this.context.formBuilder.resolvePreviewComponent(field, fieldType) || FallbackPreviewComponent

    const passSerialized = value.constructor.passSerialized

    return (
      <PreviewComponent
        value={passSerialized ? value.serialize() : value}
        field={field}
        type={fieldType}
        context="blockEditor"
      />
    )
  }
}
