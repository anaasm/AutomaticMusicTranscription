import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {Navbar,Nav} from 'react-bootstrap';
import DownloadLink from "react-download-link";
import { userActions } from '../_actions';
import {getLink} from '../_helpers';

class HomePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scoreName: '',
            uploadedFilePath: '',
            uploadedFile:null,
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getDataFromURL = this.getDataFromURL.bind(this);
    }

     changeHandler(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
        this.setState({uploadedFile: event.target.files[0]});
	 };

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { scoreName, uploadedFile } = this.state;
        if (scoreName && uploadedFile) {
            this.props.submit(scoreName,uploadedFile);
            console.log("ScoreName: " + scoreName + ", uploadedFile: " + uploadedFile);
        }
    }

    getDataFromURL(url){
        return new Promise((resolve, reject) => {
        setTimeout(() => {
            fetch(url)
                .then(data => {
                    resolve(data)
                });
            });
        }, 2000)
    };

    render() {
        const { availableUrl , pdf ,loading} = this.props;
        const { scoreName, uploadedFilePath, submitted} = this.state;
        return (
            <div className="container-fluid h-100">
                <div className=" row justify-content-center ">
                <Navbar className="py-3" bg="dark" variant="dark">
                    <Nav className="mr-auto">
                        <div className="list-group list-group-horizontal">
                            <Link to="/" className="btn btn-dark btn-lg my-2 my-sm-0 py-3 " style={{fontSize:25}}>Home</Link>
                        </div>
                    </Nav>

                    <Nav className="ml-auto my-lg-0 my-2">
                        <Link to="/login" className="btn btn-dark btn-lg my-2 my-sm-0 py-3" style={{fontSize:25}}>Logout</Link>
                    </Nav>
                </Navbar>
                </div>
                <div className="row justify-content-center">
                <div className="col col-sm-6 col-md-6 col-lg-5 col-xl-3">
                <form name="form" onSubmit={this.handleSubmit} className="py-3" >
                    <div className={'form-group' + (submitted && !scoreName ? ' has-error' : '')}>
                        <label htmlFor="scoreName" className="text-light">Numele partiturii</label>
                        <input type="text" className="form-control form-control-lg" name="scoreName" placeholder="Numele partiturii" value={scoreName} onChange={this.handleChange} />
                        {submitted && !scoreName &&
                            <div className="help-block">Numele partiturii este necesar !!!</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !scoreName ? ' has-error' : '')}>
                        <label htmlFor="uploadedFilePath" className="text-light">Încarcă fișierul .wav aici:</label>
                        <input type="file" className="form-control form-control-lg" name="uploadedFilePath" value={uploadedFilePath} onChange={this.changeHandler} />
                        {submitted && !uploadedFilePath &&
                            <div className="help-block">Încărcarea fișierului este necesară !!!</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-dark btn-lg">Submit</button>
                        {loading &&
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                        {availableUrl && getLink()

                        }
                    </div>
                </form>
                </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { availableUrl, loading, pdf} = state.users;
    return { availableUrl,loading, pdf};
}

const actionCreators = {
    submit: userActions.submit,
    handleDownload: userActions.handleDownload
}

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };