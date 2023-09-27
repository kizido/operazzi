import { Container, Table } from "react-bootstrap";
import ProductsPageLoggedInView from "../components/ProductsPageLoggedInView";
import ProductsPageLoggedOutView from "../components/ProductsPageLoggedOutView";
import styles from '../styles/ProductsPage.module.css';
import { User } from "../models/user";
import ProductTable from "../components/ProductTable";

interface ProductsPageProps {
    loggedInUser: User | null,
}

const ProductsPage = ({loggedInUser}: ProductsPageProps) => {
    return (
        <Container className={styles.productsPage}>
				<>
					{loggedInUser
						? <ProductsPageLoggedInView />
						: <ProductsPageLoggedOutView />
					}
				</>
			</Container>
    );
}
 
export default ProductsPage;