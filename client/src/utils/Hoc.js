import React from "react"
import { store } from "../store/store"
import jwtDecode from "jwt-decode"
import { Navigate } from "react-router-dom"
import { RouteStrings } from "./common"
import { resetAuth } from "../store/reducers/ui.reducer"

const Hoc = (Component) => {


    return class extends React.Component {
        state = {
            isExpire: false
        }

        componentDidMount() {
            let accessToken = store.getState().UIStore.access_token
            if (accessToken) {
                const _accessToken = jwtDecode(accessToken)
                let expireDate = new Date(_accessToken.exp * 1000)
                if (new Date() > expireDate) {
                    this.state.isExpire = true
                    store.dispatch(resetAuth())
                } else {
                    this.state.isExpire = false
                }
            }
        }

        render() {

            return (<>
                {!this.state.isExpire ? <Component /> : <Navigate to={`/login`} replace={true} />}
            </>)
        }
    }

}

export default Hoc;