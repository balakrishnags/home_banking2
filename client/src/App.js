import { useState } from "react";
import "./App.css";
import RouteCheck from "./routes/RouteCheck";
import { Header } from "./components/Header/Header";
import { UpdatePassword } from "./pages/Auth/UpdatePassword/UpdatePassword";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetAuth, setExpired, setScannerModal, setSnackbar } from "./store/reducers/ui.reducer";
import { ENVDATA } from "./Conflict/Conflct";
import { Spinner } from "./components/Spinner/Spinner";
import { LogoutModal } from "./components/LogoutModal/LogoutModal";
import { RouteStrings } from "./utils/common";
import { SnackBar } from "./components/SnackBars/SnackBar";
import { QrComponent } from "./components/QrComponent/QrComponent";
import { ModalComponent } from "./components/modal/ModalComponent";

function App() {
  const { userInfo, loader, isExpired, snackbar, scannerModal } = useSelector((state) => state.UIStore);

  // let show = (role !== "super_admin" && isAuthenticate == 0)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // const handleLogoutModal = () => {
  //   dispatch(resetAuth());
  //   navigate("/login")
  // }

  const handlesnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(setSnackbar({ isOpen: false, message: "", isSuccess: snackbar.isSuccess }))
  };

  return (
    <div>
      <Header />
      <div>
        <RouteCheck />
      </div>

      {/* <UpdatePassword updateModal={show} handleClick={handleUpdateModal} /> */}
      <Spinner spin={loader} />

      {/* <LogoutModal logoutModal={isExpired} handleLogout={handleLogoutModal} /> */}
      <SnackBar snackbarOpen={snackbar.isOpen} handleClose={handlesnackClose} message={snackbar.message}
        snackbg={snackbar.isSuccess} />

      {/* // scanner modal  */}
      <ModalComponent show={scannerModal} onHide={() => { dispatch(setScannerModal(false)) }} modal_header={"Scan QR code"} modal_body={
        <>
          <QrComponent scannerView={scannerModal} />
        </>
      } />
    </div>
  );
}

export default App;
