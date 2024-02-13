import {
  Button,
  Col,
  Form,
  Modal,
  Nav,
  Row,
  Spinner,
  Tab,
} from "react-bootstrap";
import { Product } from "../models/product";
import { useForm } from "react-hook-form";
import { ProductInput } from "../network/products_api";
import * as ProductsApi from "../network/products_api";
import TextInputField from "./form/TextInputField";
import DimensionsInputField from "./form/DimensionsInputField";
import styles from "../styles/Modal.module.css";
import { useEffect, useState, useContext } from "react";
import CategoryInputField from "./form/CategoryInputField";
import BrandInputField from "./form/BrandInputField";
import PackageTypeInputField from "./form/PackageTypeInputField";
import addImageIcon from "../assets/addImageIcon.png";
import GalleryModal from "./GalleryModal";
import { ProductImage } from "../models/productImage";
import MasterCaseDimensionsInputField from "./form/MasterCaseDimensionsInputField";
import ListingSkusModal from "./ListingSkusModal";
import VendorProductsModal from "./VendorProductsModal";
import Customs from "./Customs";
import { CustomsInput } from "../network/products_api";
import Pricing from "./Pricing";
import { ProductContext } from "../contexts/ProductContext";
import { VendorProductsModel } from "./VendorProductsTable";
import PackagingModal from "./PackagingModal";
import { PackagingModel } from "./PackagingTable";
import TextDisplayField from "./form/TextDisplayField";
import PercentageInputField from "./form/PercentageInputField";
import MoneyInputField from "./form/MoneyInputField";
import UPCBarcodeInputField from "./form/UPCBarcodeInputField";

interface AddEditProductDialogProps {
  productToEdit?: Product;
  onDismiss: () => void;
  onProductSaved: (product: Product) => void;
}

const AddEditProductDialog = ({
  productToEdit,
  onDismiss,
  onProductSaved,
}: AddEditProductDialogProps) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    defaultValues: {
      name: productToEdit?.name || "",
      productSku: productToEdit?.productSku || "",
      brand: productToEdit?.brand || "",
      barcodeUpc: productToEdit?.barcodeUpc || "",
      category: productToEdit?.category || "",
      description: productToEdit?.description || "",
      cogs: productToEdit?.cogs || "",
      dimensions: {
        productLength: productToEdit?.dimensions?.productLength || 0,
        productWidth: productToEdit?.dimensions?.productWidth || 0,
        productHeight: productToEdit?.dimensions?.productHeight || 0,
        productDiameter: productToEdit?.dimensions?.productDiameter || 0,
      },
      masterCaseDimensions: {
        masterCaseLength:
          productToEdit?.masterCaseDimensions?.masterCaseLength || 0,
        masterCaseWidth:
          productToEdit?.masterCaseDimensions?.masterCaseWidth || 0,
        masterCaseHeight:
          productToEdit?.masterCaseDimensions?.masterCaseHeight || 0,
        masterCaseQuantity:
          productToEdit?.masterCaseDimensions?.masterCaseQuantity || 0,
      },
      masterCaseWeight: productToEdit?.masterCaseWeight || 0,
      packageTypeId: productToEdit?.packageTypeId || null,
      weight: productToEdit?.weight || "",
      domesticShippingCosts: productToEdit?.domesticShippingCosts || "",
      internationalShippingCosts:
        productToEdit?.internationalShippingCosts || "",
      dutiesAndTariffs: productToEdit?.dutiesAndTariffs || "25.00",
      pickAndPackFee: productToEdit?.pickAndPackFee || "",
      amazonReferralFee: productToEdit?.amazonReferralFee || "",
      opex: productToEdit?.opex || "",
      productImageId: productToEdit?.productImageId || null,
      activated: productToEdit?.activated || true,
    },
  });

  const productContext = useContext(ProductContext);

  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  const [customsData, setCustomsData] = useState<CustomsInput | null>(null);
  const [cogsDefaultRowId, setCogsDefaultRowId] = useState<string | null>(null);
  const [listingSkusInputData, setListingSkusInputData] = useState<
    ProductsApi.ListingSkusInput[] | null
  >([]);
  const [vendorProductsInputData, setVendorProductsInputData] = useState<
    VendorProductsModel[] | null
  >([]);
  const [packagingInputData, setPackagingInputData] = useState<
    PackagingModel[]
  >([]);

  const [opexData, setOpexData] = useState("");
  const [ppcSpendData, setPpcSpendData] = useState("");
  const [growthData, setGrowthData] = useState("");
  const [netProfitTargetData, setNetProfitTargetData] = useState("");

  const [calculatedISC, setCalculatedISC] = useState("");
  const [retrievedUnitCogs, setRetrievedUnitCogs] = useState("");

  // const watchedCogs = watch("cogs");
  const watchedWeight = watch("weight");
  // const watchedISC = watch("internationalShippingCosts");
  const watchedPackageId = watch("packageTypeId");
  const watchedDutiesAndTariffs = watch("dutiesAndTariffs");
  const watchedDSC = watch("domesticShippingCosts");
  const watchedPickAndPackFee = watch("pickAndPackFee");
  const watchedAmazonReferralFee = watch("amazonReferralFee");

  useEffect(() => {
    if (productToEdit) {
      productContext?.setProduct(productToEdit);
      setListingSkusInputData(productToEdit.productListingSkus);
      setVendorProductsInputData(productToEdit.productVendorProducts);
      setPackagingInputData(productToEdit.productPackaging);
      setCogsDefaultRowId(productToEdit.vendorProductCogsDefaultRow);

      setOpexData(productToEdit.opex || "");
      setPpcSpendData(productToEdit.ppcSpend || "");
      setGrowthData(productToEdit.growth || "");
      setNetProfitTargetData(productToEdit.netProfitTarget || "");

      calculateISC();
    } else {
      productContext?.setProduct(null);
    }
    const loadImage = async () => {
      if (productToEdit && productToEdit.productImageId) {
        try {
          const imageToLoad = await ProductsApi.fetchProductImage(
            productToEdit.productImageId
          );
          setSelectedImage(imageToLoad);
          setImageLoading(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        setImageLoading(false);
      }
    };
    loadImage();
  }, []);

  // Testing Code
  useEffect(() => {
    productContext?.setProduct(productToEdit ?? null);
  }, [productToEdit]);
  useEffect(() => {
    if (
      productToEdit != null &&
      cogsDefaultRowId != null &&
      vendorProductsInputData != null &&
      +cogsDefaultRowId < vendorProductsInputData.length
    ) {
      console.log("COGS DEFAULT ROW: " + cogsDefaultRowId);
      console.log("Vendor Products Length: " + vendorProductsInputData.length);
      try {
        setRetrievedUnitCogs(
          vendorProductsInputData[+cogsDefaultRowId].perUnitCogs
        );
      } catch (error) {
        console.error(error);
      }
    }
  }, [vendorProductsInputData, cogsDefaultRowId]);

  async function onSubmit(input: ProductInput) {
    selectedImage && (input.productImageId = selectedImage?._id);
    if (input.packageTypeId === "") input.packageTypeId = null;
    if (customsData) input.productCustomsInfo = customsData;
    if (listingSkusInputData) input.productListingSkus = listingSkusInputData;
    if (vendorProductsInputData)
      input.productVendorProducts = vendorProductsInputData;
    if (packagingInputData) input.productPackaging = packagingInputData;
    input.vendorProductCogsDefaultRow = cogsDefaultRowId;

    if (opexData) input.opex = opexData;
    if (ppcSpendData) input.ppcSpend = ppcSpendData;
    if (growthData) input.growth = growthData;
    if (netProfitTargetData) input.netProfitTarget = netProfitTargetData;

    try {
      let productResponse: Product;
      if (productToEdit) {
        productResponse = await ProductsApi.updateProduct(
          productToEdit._id,
          input
        );
      } else {
        productResponse = await ProductsApi.createProduct(input);
      }
      onProductSaved(productResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const handleCustomsData = (input: CustomsInput) => {
    setCustomsData({
      customsDeclaration: input.customsDeclaration,
      itemDescription: input.itemDescription,
      harmonizationCode: input.harmonizationCode,
      countryOrigin: input.countryOrigin,
      declaredValue: input.declaredValue,
    });
  };
  const handleListingSkusData = (
    input: ProductsApi.ListingSkusInput,
    index?: number
  ) => {
    if (index !== undefined) {
      setListingSkusInputData((currentData) => {
        const newData = [...currentData!];
        newData[index] = input;
        return newData;
      });
      // setListingSkusInputData([]);
    } else {
      setListingSkusInputData((currentData) => {
        return currentData ? [...currentData, input] : [input];
      });
    }
  };
  const handleListingSkuDelete = (index: number) => {
    if (listingSkusInputData) {
      setListingSkusInputData(
        listingSkusInputData.filter((sku, idx) => idx !== index)
      );
    }
  };
  const handleVendorProductsData = (
    input: VendorProductsModel,
    index?: number
  ) => {
    if (index !== undefined) {
      setVendorProductsInputData((currentData) => {
        const newData = [...currentData!];
        newData[index] = input;
        return newData;
      });
    } else {
      setVendorProductsInputData((currentData) => {
        return currentData ? [...currentData, input] : [input];
      });
    }
  };
  const handleVendorProductDelete = (index: number) => {
    if (vendorProductsInputData) {
      setVendorProductsInputData((vProducts) =>
        vProducts!.filter((_, idx) => idx !== index)
      );
    }
  };
  const handlePackagingData = (input: PackagingModel, index?: number) => {
    if (index !== undefined) {
      setPackagingInputData((currentData) => {
        const newData = [...currentData!];
        newData[index] = input;
        return newData;
      });
    } else {
      setPackagingInputData((currentData) => {
        return currentData ? [...currentData, input] : [input];
      });
    }
  };
  const handlePackagingDelete = (index: number) => {
    if (packagingInputData) {
      setPackagingInputData(
        packagingInputData.filter((_, idx) => idx !== index)
      );
    }
  };
  const handleDefaultCogsRowData = (rowId: string | null) => {
    setCogsDefaultRowId(rowId);
  };
  const calculateISC = () => {
    const currentWeight = parseFloat(getValues("weight"));
    console.log("CURRENT WEIGHT : " + currentWeight);
    if (isNaN(currentWeight)) {
      return "";
    }
    const iscPerGram = 0.004;
    setCalculatedISC((currentWeight * iscPerGram).toFixed(2).toString());
  };
  const handlePricingDataSubmit = (name: string, value: string) => {
    switch (name) {
      case "opex":
        setOpexData(value);
        break;
      case "ppcSpend":
        setPpcSpendData(value);
        break;
      case "growth":
        setGrowthData(value);
        break;
      case "netProfitTarget":
        setNetProfitTargetData(value);
        break;
      default:
        // Handle default case or throw an error
        break;
    }
  };
  function saveImageToProduct(updatedImage: ProductImage | null) {
    setSelectedImage(updatedImage);
  }

  return (
    <Modal
      show
      onHide={onDismiss}
      backdrop="static"
      centered={true}
      dialogClassName={`${styles.productModalWidth}`}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {productToEdit ? productToEdit.name : "Add Product"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.productModalBody}>
        <Tab.Container defaultActiveKey="basicInfo">
          <Nav variant="tabs" className={styles.productModalTabs}>
            <Nav.Item>
              <Nav.Link
                className={styles.productModalTabLink}
                eventKey="basicInfo"
              >
                BASIC INFO
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={styles.productModalTabLink}
                eventKey="packaging"
              >
                PACKAGING
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={styles.productModalTabLink}
                eventKey="listingSkus"
              >
                LISTING SKUS
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={styles.productModalTabLink}
                eventKey="vendorProducts"
              >
                VENDOR PRODUCTS
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={styles.productModalTabLink}
                eventKey="customs"
              >
                CUSTOMS
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={styles.productModalTabLink}
                eventKey="pricing"
              >
                PRICING
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="basicInfo">
              <Form id="addEditProductForm" onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col xs={9}>
                    <TextInputField
                      name="name"
                      label="Product Name*"
                      type="text"
                      placeholder="Product Name"
                      register={register}
                      registerOptions={{ required: "Required" }}
                    />
                    <BrandInputField
                      name="brand"
                      label="Brand*"
                      type="text"
                      placeholder="Brand"
                      register={register}
                      registerOptions={{ required: "Required" }}
                      setValue={setValue}
                    />
                    <CategoryInputField
                      name="category"
                      label="Category"
                      type="text"
                      placeholder="Category"
                      register={register}
                    />
                  </Col>
                  <Col>
                    <button
                      type="button"
                      className={styles.productPreviewContainer}
                      onClick={() => setShowGalleryModal(true)}
                    >
                      {imageLoading ? (
                        <Spinner />
                      ) : (
                        <img
                          src={
                            selectedImage
                              ? `data:${selectedImage.contentType};base64,${selectedImage.imageFileBase64}`
                              : addImageIcon
                          }
                          alt={selectedImage?._id}
                          className={styles.productPreviewImage}
                        />
                      )}
                    </button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TextInputField
                      name="productSku"
                      label="Product Sku*"
                      type="text"
                      placeholder="Product Sku"
                      register={register}
                      registerOptions={{ required: "Required" }}
                    />
                  </Col>
                  <Col>
                    <UPCBarcodeInputField
                      name="barcodeUpc"
                      label="UPC-A Barcode"
                      type="text"
                      placeholder="UPC Barcode"
                      setValue={setValue}
                      control={control}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <DimensionsInputField
                      name="dimensions"
                      label="Dimensions | (Length x Width x Height x Diameter)"
                      register={register}
                    />
                  </Col>
                  <Col>
                    <TextInputField
                      name="weight"
                      label="Weight (grams)"
                      type="text"
                      placeholder="Weight"
                      register={register}
                      registerOptions={{
                        onBlur: calculateISC,
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <MoneyInputField
                      name="domesticShippingCosts"
                      label="Ship to Amazon FBA Cost"
                      type="text"
                      placeholder="Ship to Amazon FBA Cost  "
                      register={register}
                      setValue={setValue}
                      control={control}
                    />
                  </Col>
                  <Col>
                    <PackageTypeInputField
                      name="packageTypeId"
                      label="Shipping Package"
                      type="select"
                      register={register}
                      packageId={productToEdit?.packageTypeId}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <MoneyInputField
                      name="pickAndPackFee"
                      label="Pick And Pack Fee"
                      type="text"
                      placeholder="Pick And Pack Fee"
                      register={register}
                      setValue={setValue}
                      control={control}
                    />
                  </Col>
                  <Col>
                    <PercentageInputField
                      name="dutiesAndTariffs"
                      label="Duties And Tariffs"
                      type="text"
                      placeholder="Duties And Tariffs"
                      register={register}
                      setValue={setValue}
                      control={control}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <MoneyInputField
                      name="amazonReferralFee"
                      label="Amazon Referral Fee"
                      type="text"
                      placeholder="Amazon Referral Fee"
                      register={register}
                      setValue={setValue}
                      control={control}
                    />
                  </Col>
                  <Col>
                    <TextInputField
                      name="description"
                      label="Description"
                      type="text"
                      placeholder="Description"
                      register={register}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <MasterCaseDimensionsInputField
                      name="masterCaseDimensions"
                      label="Master Case Dimensions"
                      register={register}
                    />
                  </Col>
                  <Col>
                    <TextInputField
                      name="masterCaseWeight"
                      label="Master Case Weight (lbs.)"
                      type="number"
                      placeholder="Master Case Weight"
                      register={register}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TextDisplayField
                      name="cogs"
                      label="Cost of Goods Sold"
                      type="text"
                      placeholder="N/A"
                      value={retrievedUnitCogs}
                    />
                  </Col>
                  <Col>
                    <TextDisplayField
                      name="internationalShippingCosts"
                      label="International Shipping Costs"
                      type="text"
                      placeholder="N/A"
                      value={calculatedISC}
                    />
                  </Col>
                </Row>
              </Form>
            </Tab.Pane>
            <Tab.Pane eventKey="packaging">
              <PackagingModal
                packagingDataSubmit={handlePackagingData}
                deletePackaging={handlePackagingDelete}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="listingSkus">
              <ListingSkusModal
                onListingSkusDataSubmit={handleListingSkusData}
                onListingSkuDelete={handleListingSkuDelete}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="vendorProducts">
              <VendorProductsModal
                productToEdit={productToEdit}
                vendorProductsDataSubmit={handleVendorProductsData}
                deleteVendorProduct={handleVendorProductDelete}
                defaultCogsRowIdSubmit={handleDefaultCogsRowData}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="customs">
              <Customs
                productToEdit={productToEdit}
                onCustomsDataSubmit={handleCustomsData}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="pricing">
              <Pricing
                pricingDataSubmit={handlePricingDataSubmit}
                productToEdit={productToEdit}
                packageId={watchedPackageId}
                cogs={retrievedUnitCogs}
                isc={calculatedISC}
                weight={watchedWeight}
                dutiesAndTariffs={watchedDutiesAndTariffs}
                dsc={watchedDSC}
                pickAndPackFee={watchedPickAndPackFee}
                amazonReferralFee={watchedAmazonReferralFee}
                packaging={packagingInputData}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="addEditProductForm" disabled={isSubmitting}>
          Save
        </Button>
      </Modal.Footer>
      {showGalleryModal && (
        <GalleryModal
          onDismiss={() => setShowGalleryModal(false)}
          onSave={saveImageToProduct}
        />
      )}
    </Modal>
  );
};

export default AddEditProductDialog;
