import React from 'react'
import PropTypes from 'prop-types'
import CloseIcon from 'part:@sanity/base/close-icon'
import CheckCircleIcon from 'part:@sanity/base/circle-check-icon'
import WarningIcon from 'part:@sanity/base/warning-icon'
import ErrorIcon from 'part:@sanity/base/error-icon'
import InfoIcon from 'part:@sanity/base/info-icon'
import styles from './styles/SnackbarItem.css'
import Button from 'part:@sanity/components/buttons/default'

export default class SnackbarItem extends React.Component {
  static propTypes = {
    action: PropTypes.shape({
      title: PropTypes.string,
      icon: PropTypes.func,
      callback: PropTypes.func
    }),
    autoDismissTimeout: PropTypes.number,
    children: PropTypes.node,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.bool]),
    isOpen: PropTypes.bool.isRequired,
    isPersisted: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    kind: PropTypes.oneOf(['info', 'warning', 'error', 'success']),
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    onDismiss: PropTypes.func,
    offset: PropTypes.number,
    onHide: PropTypes.func,
    onSetHeight: PropTypes.func,
    setAutoFocus: PropTypes.bool,
    transitionDuration: PropTypes.number,
    isCloseable: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      isEntering: true
    }
    this._snackRef = React.createRef()
  }

  static defaultProps = {
    action: undefined,
    autoDismissTimeout: 4000,
    children: null,
    icon: null,
    isPersisted: false,
    kind: 'info',
    offset: null,
    onDismiss: () => {},
    onSetHeight: () => {},
    setAutoFocus: false,
    transitionDuration: 200
  }

  DEFAULT_ICONS = {
    info: <InfoIcon />,
    success: <CheckCircleIcon />,
    warning: <WarningIcon />,
    error: <ErrorIcon />
  }

  snackIcon = () => {
    const {icon, kind} = this.props
    if (typeof icon === 'boolean' && icon) return this.DEFAULT_ICONS[kind]
    if (typeof icon === 'object' || typeof icon === 'string') return icon
    return undefined
  }

  handleAutoDismissSnack = () => {
    const {autoDismissTimeout, isPersisted, id, onDismiss, onHide} = this.props
    if (!isPersisted) {
      this._dismissTimer = setTimeout(() => {
        if (onHide) onHide()
        onDismiss(id)
      }, autoDismissTimeout)
    }
  }

  handleMouseOver = () => {
    this.cancelAutoDismissSnack()
  }

  handleMouseLeave = () => {
    const {isPersisted} = this.props
    if (!isPersisted) {
      this.handleAutoDismissSnack()
    }
  }

  handleAction = () => {
    const {id, onAction, onDismiss} = this.props
    if (onAction) onAction()
    return onDismiss(id)
  }

  handleClose = () => {
    const {id, onDismiss} = this.props
    return onDismiss(id)
  }

  cancelAutoDismissSnack = () => {
    clearTimeout(this._dismissTimer)
  }

  componentDidMount() {
    const {onSetHeight, id, isPersisted, setAutoFocus} = this.props

    if (setAutoFocus) {
      this._snackRef.current.focus()
      this.cancelAutoDismissSnack()
    }

    const height = this._snackRef.current && this._snackRef.current.clientHeight
    onSetHeight(id, height)

    if (isPersisted) this.cancelAutoDismissSnack()
    else this.handleAutoDismissSnack()

    this._enterTimer = setTimeout(() => {
      this.setState({
        isEntering: false
      })
    }, 100)
  }

  componentWillUnmount() {
    clearTimeout(this._dismissTimer)
    clearTimeout(this._enterTimer)
  }

  render() {
    const {
      action,
      children,
      icon,
      id,
      isOpen,
      kind,
      message,
      offset,
      transitionDuration,
      isCloseable
    } = this.props

    const rootStyles = this.state.isEntering
      ? `${styles.root}`
      : `${styles.root} ${isOpen ? styles.showSnack : styles.dismissSnack}`

    const transition = `all ${transitionDuration}ms ease-in-out`
    const role = () => {
      if (kind === 'success') return 'status'
      if (kind === 'info') return 'log'
      return 'alert'
    }
    return (
      <div
        aria-label={kind}
        aria-describedby={`snackbarMessage-${kind}-${id}`}
        role={role()}
        ref={this._snackRef}
        tabIndex="-1"
        className={rootStyles}
        style={{bottom: offset, transition: transition}}
        onMouseOver={() => this.handleMouseOver()}
        onMouseLeave={() => this.handleMouseLeave()}
        onFocus={() => this.handleMouseOver()}
        onBlur={() => this.handleMouseLeave()}
        onKeyDown={e => e.key === 'escape' && this.handleAction()}
        data-kind={kind}
      >
        <div className={styles.inner}>
          {icon && (
            <div role="img" aria-hidden className={styles.icon}>
              {this.snackIcon()}
            </div>
          )}
          <div className={styles.content}>
            <div id={`snackbarMessage-${kind}-${id}`}>{message}</div>
            {children && <div className={styles.snackbarChildren}>{children}</div>}
          </div>
          {action && (
            <div className={styles.actionButtonContainer}>
              <Button
                aria-label={action.title}
                // eslint-disable-next-line react/jsx-handler-names
                onClick={action.callback}
                bleed
                kind="simple"
                // icon={action.icon}
              >
                {action.title}
              </Button>
            </div>
          )}
          {isCloseable && (
            <div className={styles.closeButtonContainer}>
              <Button
                aria-label="Close"
                className={styles.closeButton}
                onClick={this.handleClose}
                bleed
                kind="simple"
                icon={CloseIcon}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}
