import React, {Component} from 'react';

class Form extends Component {
    constructor() {
        super();
        this.state = {
            query: ''
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            this.props.handleSubmit(this.state.query);
        }
    }

    render() {
        return (
            <div id="form">
                <input id="search-bar" type="text" autocomplete="off" placeholder="Search..." onChange={(e) => this.setState({query: e.target.value})} onKeyDown={(e) => this.handleKeyDown(e)}></input>
                <button className="btn-lg" type="submit" onClick={() => this.props.handleSubmit(this.state.query)}>Submit</button>
            </div>
        );
    }
}

export default Form;