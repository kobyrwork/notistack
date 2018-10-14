import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { styles, getTransitionStyles } from './SnackbarItem.styles';
import {
    capitalise,
    defaultAnchorOrigin,
    getTransitionDirection,
    TransitionComponent,
    variantIcon,
} from './SnackbarItem.util';


class SnackbarItem extends Component {
    handleClose = key => (event, reason) => {
        const { onClose } = this.props;
        if (reason === 'clickaway') return;
        onClose(key);
    };

    render() {
        const {
            classes,
            action,
            anchorOrigin = defaultAnchorOrigin,
            ContentProps = {},
            hideIconVariant,
            iconVariant,
            level,
            snack,
            snack: {
                key,
                variant = 'default',
                ...singleSnackProps
            },
            style,
            onExited,
            onClickAction,
            ...props
        } = this.props;

        const contentProps = {
            ...ContentProps,
            ...singleSnackProps.ContentProps,
            action: snack.action || ContentProps.action || action,
        };

        let onClickHandler = snack.action ? snack.onClickAction : onClickAction;
        onClickHandler = onClickHandler || this.handleClose(key);

        return (
            <Snackbar
                autoHideDuration={5000}
                anchorOrigin={anchorOrigin}
                TransitionComponent={TransitionComponent}
                TransitionProps={{
                    direction: getTransitionDirection(anchorOrigin),
                }}
                style={{
                    ...style,
                    ...getTransitionStyles(level, anchorOrigin),
                }}
                {...props}
                {...singleSnackProps}
                open={snack.open}
                onClose={this.handleClose(key)}
                onExited={() => onExited(key)}
            >
                <SnackbarContent
                    className={classes[`variant${capitalise(variant)}`]}
                    {...contentProps}
                    aria-describedby="client-snackbar"
                    message={(
                        <span id="client-snackbar" className={classes.message}>
                            {!hideIconVariant && (
                                <span className={classes.iconVariant}>
                                    {iconVariant[variant]}
                                </span>
                            )}
                            {snack.message}
                        </span>
                    )}
                    action={contentProps.action && (
                        <span onClick={onClickHandler}>
                            {contentProps.action}
                        </span>
                    )}
                />
            </Snackbar>
        );
    }
}

SnackbarItem.propTypes = {
    classes: PropTypes.object.isRequired,
    /**
     * Level on which snakcbar should be displayed
     * (when snackbars are stacked on top of eachother)
     */
    level: PropTypes.number.isRequired,
    snack: PropTypes.shape({
        /**
         * Text of the snackbar/notification.
         */
        message: PropTypes.string.isRequired,
        /**
         * Type of snackbar. defaulted to 'default'.
         */
        variant: PropTypes.oneOf(
            ['default', 'error', 'success', 'warning', 'info'],
        ),
        /**
         * Event fired when clicked on action button of
         * a snackbar. defaulted to dismiss the snackbar.
         */
        onClickAction: PropTypes.func,
        /**
         * Identifier of a given snakcbar.
         */
        key: PropTypes.number.isRequired,
        /**
         * Whether or not a snackbar is visible or hidden.
         */
        open: PropTypes.bool.isRequired,
    }).isRequired,
    /**
     * Little icon that is displayed at left corner of a snackbar.
     */
    iconVariant: PropTypes.shape({
        /**
         * Icon displayed when variant of a snackbar is set to `success`.
         */
        success: PropTypes.any.isRequired,
        /**
         * Icon displayed when variant of a snackbar is set to `warning`.
         */
        warning: PropTypes.any.isRequired,
        /**
         * Icon displayed when variant of a snackbar is set to `error`.
         */
        error: PropTypes.any.isRequired,
        /**
         * Icon displayed when variant of a snackbar is set to `info`.
         */
        info: PropTypes.any.isRequired,
    }),
    /**
     * iconVariant will not be rendered if set to `true`.
     */
    hideIconVariant: PropTypes.bool,
    /**
     * Event fired when clicked on action button of
     * a snackbar. defaulted to dismiss the snackbar.
     */
    onClickAction: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    onExited: PropTypes.func.isRequired,
};

SnackbarItem.defaultProps = {
    iconVariant: variantIcon,
    hideIconVariant: false,
    onClickAction: undefined,
};

export default withStyles(styles)(SnackbarItem);
