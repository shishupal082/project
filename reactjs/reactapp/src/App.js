import React from 'react';
import './libs/bootstrap-react-v3.1.1.css';
import $S from "./libs/stack.js";
import Table from "./components/Table";

var api = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";
api = "http://localhost:3000/appData.json";
// api = "http://localhost:3000/pvt/app-data/appData.json";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            btnActive: true
        };
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        fetch(api)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result,
                        error: null
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        items: [],
                        error: error.toString()
                    });
                }
            );
    }
    handleClick() {
        this.setState({
            btnActive: !this.state.btnActive
        });
        this.fetchData();
    }
    render() {
        var tData = [];
        if ($S.isArray(this.state.items)) {
            tData = this.state.items;
        }
        var display = "Loading...";
        if (this.state.isLoaded) {
            if (tData.length) {
                var table = $S.getTable(tData, "dashboard");
                table.addColIndex(1);
                table.addRowIndex(0);
                table.updateTableContent(0,0,"");
                tData = table.getContent();
                display = <Table tId="dashboard" 
                            cName="table table-bordered" tData={tData}/>;
            } else {
                var localErrorText = this.state.error;
                display = <center>{localErrorText}</center>;
            }
        }
        var btnClassName = this.state.btnActive ? "btn btn-primary" : "btn btn-success";
        return (
            <div className="container">
                <div>
                    <center>
                        <h2>React.js App Dashboard &nbsp;
                        <button onClick={this.handleClick} className={btnClassName}>Click to reload</button>
                        </h2>
                    </center>
                </div>
                <hr></hr>
                <div id="tableHtml">
                    {display}
                </div>
            </div>
        );
    }
}

export default App;
