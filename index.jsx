'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var dispatcher = require('@crsincca/xrd-dispatch-module');

function mergeItemToMenu(payload, menu) {
    Object.keys(payload).forEach(function (menuKey) {
        if (Object.prototype.hasOwnProperty.call(menu, menuKey)) {
            Object.keys(payload[menuKey]).forEach(function (itemKey) {
                menu[menuKey][itemKey] = payload[menuKey][itemKey];
            });
        } else {
            menu[menuKey] = payload[menuKey];
        }
    });
}

class XrdMainMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menu: {}
        };
    }

    componentDidMount() {
        dispatcher.on('addMainMenuItem', this.onAddMenuItem.bind(this));
    }

    onAddMenuItem(payload) {
        var menu = this.state.menu;
        mergeItemToMenu(payload, menu);
        this.setState(menu);
    }

    generateMenuBar(menu) {
        var menuBar = Object.keys(menu).map(function (key) {
            return (
                <div key={key} className='btn-group'>
                    <button type='button' className='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                        {key} <span className='caret'></span>
                    </button>
                    <ul className='dropdown-menu'>
                        {this.generateMenuItems(menu[key])}
                    </ul>
                </div>
            );
        }, this);
        return menuBar;
    }

    generateMenuItems(items) {
        var menuItems = Object.keys(items).map(function (itemKey) {
            // <li role='separator' className='divider'></li>
            if (items[itemKey]['data-toggle']) {
                return (
                    <li key={itemKey}>
                        <a data-toggle={items[itemKey]['data-toggle']} href={items[itemKey]['href']} onClick={this.onClickMenuItem.bind(this, items[itemKey].message)}>{itemKey}</a>
                    </li>
                );
            }
            return (
                <li key={itemKey}>
                    <a href='#' onClick={this.onClickMenuItem.bind(this, items[itemKey].message)}>{itemKey}</a>
                </li>
            );
        }, this);
        return menuItems;
    }

    onClickMenuItem(message) {
        dispatcher.emit(message);
    }

    render() {
        return (
            <div>
                {this.generateMenuBar(this.state.menu)}
            </div>
        );
    }

}

dispatcher.on('init-main-menu', function (payload) {
    ReactDOM.render(<XrdMainMenu />, document.getElementById(payload.elementId));
});

dispatcher.emit('plugin-hand-shake', 'xrd-main-menu');
