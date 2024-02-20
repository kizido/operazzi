import { useEffect, useState } from 'react';
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';
import SignUpModal from './components/SignUpModal';
import { User } from './models/user';
import * as ProductsApi from "./network/products_api";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ProductsPage from './pages/ProductsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import styles from './styles/App.module.css';
import VerificationSuccessfulPage from './components/VerificationSuccessfulPage';
import VerificationFailedPage from './components/VerificationFailedPage';
import toast, { Toaster } from 'react-hot-toast';

function App() {

	const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);

	useEffect(() => {
		async function fetchLoggedInUser() {
			try {
				console.log("HELLO")
				const user = await ProductsApi.getLoggedInUser();
				setLoggedInUser(user);
			} catch (error) {
				console.error(error);

			}
		}
		fetchLoggedInUser();
	}, []);

	return (
		<BrowserRouter>
			<div>
				<NavBar
					loggedInUser={loggedInUser}
					onLoginClicked={() => setShowLoginModal(true)}
					onSignUpClicked={() => setShowSignUpModal(true)}
					onLogoutSuccessful={() => setLoggedInUser(null)}
				/>
				<Container className={styles.pageContainer}>
					<Routes>
						<Route
							path='/'
							element={<ProductsPage loggedInUser={loggedInUser} />}
						/>
						<Route
							path='/privacy'
							element={<PrivacyPage />}
						/>
						<Route
						element={<VerificationSuccessfulPage/>}
						path='/verification-successful'/>
						<Route
						element={<VerificationFailedPage/>}
						path='/verification-failed'/>
						<Route
							path='/*'
							element={<NotFoundPage />}
						/>
					</Routes>
				</Container>
				{showSignUpModal &&
					<SignUpModal
						onDismiss={() => setShowSignUpModal(false)}
						onSignUpSuccessful={(user) => {
							// setLoggedInUser(user);
							setShowSignUpModal(false);
							toast.success("Verification link sent to your email!")
						}}
					/>

				}
				{showLoginModal &&
					<LoginModal
						onDismiss={() => setShowLoginModal(false)}
						onLoginSuccessful={(user) => {
							setLoggedInUser(user);
							setShowLoginModal(false);
						}}
					/>
				}
			</div>
			<Toaster/>
		</BrowserRouter>
	);
}

export default App;
