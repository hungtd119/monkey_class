import React from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
const renderTooltip = (message: string) => (
    <Tooltip id="button-tooltip">
        {message}
    </Tooltip>
);
const ToolTip = (props: any) => {
    const { children, message } = props;
    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(message)}
        >
            {children}
        </OverlayTrigger>
    );
}

export default ToolTip
