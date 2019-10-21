/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Clipboard,
  Alert,
  Modal
} from 'react-native';
import Timeline from 'react-native-timeline-listview';
import { Actions } from 'react-native-router-flux';
import Accordion from '@ercpereda/react-native-accordion';
import { Global } from '../../helpers/Global';
import { Icon, Button, ListItem, Header } from 'react-native-elements';
import moment from "moment";
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { showMessage } from 'react-native-flash-message';
import { postFilePublic, getPublic } from '../../providers/Api';
import { connect } from 'react-redux';
import {
  updateOrder, unsetUser
} from "./../../stores/actions/index";

class OrderStatusDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      downloadProgress: false,
      modalVisible: false,
      wips: [],
      deliveryOrderName: 'Delivery Order',
      cekFileValue: null,
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({ onPressCopy: this.onPressCopy });
    console.log("Cek Props: ")
    console.log(this.props.orderSelected)

    // Cek File Pdf
    if(this.props.orderSelected.file_po_admin == null) {
      this.setState({
        cekFileValue: this.props.orderSelected.file_po
      })
    }else {
      this.setState({
        cekFileValue: this.props.orderSelected.file_po_admin
      })
    }

  }

  // componentDidUpdate() {
  //   this.onRefresh();
  // }

  async onPressCopy(copy) {
    await Clipboard.setString(copy);
    alert(copy + ' copied');
  }

  timelineRenderTime(rowData, sectionId, rowId) {
    return (
      <View style={{ paddingBottom: 20 }}>
        <Image
          source={rowData.icon_source}
          resizeMode={'contain'}
          style={{ width: 60, height: 40 }}
        />
      </View>
    );
  }

  onRefresh() {
    // Cek File Pdf
    if(this.props.orderSelected.file_po_admin == null) {
      this.setState({
        cekFileValue: this.props.orderSelected.file_po
      })
    }else {
      this.setState({
        cekFileValue: this.props.orderSelected.file_po_admin
      })
    }
    // Cek File Pdf End
    this.setState({ refreshing: true });
    console.log("Testing Cek Data: ")
    // console.log(this.props.orderSelected.code_order);

    let uri = 'order/show?code_order=' + this.props.orderSelected.code_order;
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.props.user.token
    };

    getPublic(uri, headers).then(response => {
      this.setState({ refreshing: false });
      console.log(response);
      if (response.status == 200) {
        this.props.onUpdateOrder(response.data.data);
        return;
      }
      this.state.session.forceLogout();
    }).catch(error => {
      this.props.onUnsetUser();
      this.setState({
        refreshing: false,
      });
      Actions.login();
    });
  }

  _productImage(image) {
    if (image) {
      return Global.getProductImageUrl() + image;
    } else {
      return Global.getBaseUrl() + 'assets/images/icon/cart.png';
    }
  }

  showActionSheetUploadPO() {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.pdf()],
    }, (error, response) => {
      // console.log("Cek File Pdf: ")
      // console.log(response)
      if (error) {
        showMessage({
          message: "Upload canceled",
          type: 'info'
        });
        return;
      }

      Alert.alert(
        'Upload Purchase Order',
        'Are you sure you want to upload this ' + response.fileName + ' file?',
        [
          { text: 'Not Now', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'Yes, Upload', onPress: () => this.processUploadPo(response) },
        ],
        { cancelable: false }
      );

      console.log(
        response,
        error
      );
    });
  }

  processUploadPo(params) {
    this.setState({ uploadPo: true });
    showMessage({
      message: "Please wait for seconds",
      type: 'info'
    });

    console.log("Cek File Pdf: ")
    console.log(params)

    let url = 'order/upload-purchase-order';
    let formdata = new FormData();
    formdata.append("order_id", this.props.orderSelected.id);
    let image = [];
    image['name'] = params.fileName;
    image['type'] = params.type;
    image['uri'] = params.uri;// + '/' + params.fileName;
    formdata.append("file", image);

    let headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + this.props.user.token
    };

    postFilePublic(url, formdata, headers).then(response => {
      if (response.status == 200) {
        showMessage({
          message: response.data.message,
          type: 'success'
        });
        this.props.onUpdateOrder(response.data.data);
        console.log("cek upload Data: ")
        console.log(response)
      } else {
        showMessage({
          message: response.data.message,
          type: 'error'
        });
      }
      if (response.status == 401) {
        this.props.onUnsetUser();
        Actions.login();
        return;
      }
      this.setState({ uploadPo: false });
      console.log(response);
    }).catch(error => {
      this.setState({ uploadPo: false });
      console.log(error);
      showMessage({
        message: "Upload failed",
        type: 'warning'
      });
    });
  }

  renderProductItem(item) {
    const Header = ({ isOpen }) =>
      <View style={styles.accordionHeaderStyle}>
        <View style={{ width: 200 }}>
          <Text>{item.product_name}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={{ textAlign: 'right' }}>{isOpen ? '-' : '+'}</Text>
        </View>
      </View>;

    let priceContent = null;
    if (this.props.orderSelected.status != 'ORDER') {
      priceContent = (
        <View>
          <Text style={styles.contentLabelStyle}>Price</Text>
          <Text style={styles.contentTitleStyle}>{Global.getFormattedCurrency(item.price)}</Text>
          <Text style={styles.contentLabelStyle}>Subtotal</Text>
          <Text style={styles.contentTitleStyle}>{Global.getFormattedCurrency(item.subtotal)}</Text>
        </View>
      );
    }
    let viewDeliveryOrderButton = null;
    if (item.wips != null) {
      viewDeliveryOrderButton = (
        <View style={{
          flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
        }}>
          <Button
            title={"View Delivery Order"}
            titleStyle={{ fontWeight: "700", color: "#fff" }}
            onPress={() => {
              this.setState({
                wips: item.wips,
                deliveryOrderName: item.product_name
              }, function () {
                console.log(this.state.wips);
                this.setModalVisible(true);
              });
            }}
            buttonStyle={{
              backgroundColor: "#6bc3cd",
              width: 200,
              height: 15,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5,
            }} />
        </View>
      );
    }

    const Content = (
      <View style={styles.contentContainerStyle}>
        <TouchableOpacity onPress={() => this.onPressMoreImages(item)}>
          <Image
            source={{ uri: this._productImage(item.product_image) }}
            style={{ width: 150, height: 150, marginBottom: 10, marginLeft: 'auto', marginRight: 'auto' }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }} onPress={() => this.onPressMoreImages(item)}>
          <Text>More Images</Text>
        </TouchableOpacity>
        <Text style={styles.contentLabelStyle}>Item Name</Text>
        <Text style={styles.contentTitleStyle}>{item.product_name}</Text>
        <Text style={styles.contentLabelStyle}>Qty</Text>
        <Text style={styles.contentTitleStyle}>{item.qty_approve}</Text>
        {priceContent}
        <Text style={styles.contentLabelStyle}>Notes</Text>
        <Text style={styles.contentTitleStyle}>{item.customize_note != '' ? item.customize_note : '-'}</Text>
        <Text style={styles.contentLabelStyle}>Delivery Date</Text>
        <Text style={styles.contentTitleStyle}>{moment(item.delivery_date_c).format('DD MMM YYYY')}</Text>
        <Text style={styles.contentLabelStyle}>Delivery Address</Text>
        <Text style={styles.contentTitleStyle}>{item.customer_address.full_address}</Text>
        {viewDeliveryOrderButton}
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 10 }} />
      </View>);
    return (
      <View style={{ paddingLeft: 16, paddingRight: 16 }}>
        <Accordion
          header={Header}
          content={Content}
          duration={300}
        />
      </View>

    );
  }

  onPressMoreImages(item) {
    console.log(item);

    let baseUrl = Global.getBaseUrl() + 'backend/uploads/';

    let customerImages = JSON.parse(item.customer_image);
    let images = [];
    images.push({
      caption: item.product_name,
      source: { uri: this._productImage(item.product_image) }
    });
    if (customerImages != null) {
      customerImages.map(image => {
        images.push({
          caption: image.note,
          source: { uri: baseUrl + image.image_name }
        });
      });
    }
    console.log(images);

    Actions.imageGallery({ images: images, position: 0 });
  }

  renderConfirmPayment() {
    if (this.props.orderSelected.status == 'INVOICE_1' && this.props.orderSelected.is_active_invoice == 1 && this.props.orderSelected.status_file == 1 && (this.props.orderSelected.customer_payments.length <= 0)) {
      return (
        <Button
          backgroundColor="#f1c40f"
          title={'Confirm Payment'}
          buttonStyle={{ marginBottom: 10 }}
          onPress={() => {
            Actions.confirmPayment({
              order_number: this.props.orderSelected.code_order,
              payment_total: this.props.orderSelected.amount_1
            })
          }} />
      );
    }

    if (this.props.orderSelected.status == 'INVOICE_2' && this.props.orderSelected.amount_2 != '' && this.props.orderSelected.file_invoice_2 != '' && this.props.orderSelected.status_file == 1 && (this.props.orderSelected.customer_payments.length <= 0)) {
      return (
        <Button
          backgroundColor="#f1c40f"
          title={'Confirm Payment'}
          buttonStyle={{ marginBottom: 10 }}
          onPress={() => {
            Actions.confirmPayment({
              order_number: this.props.orderSelected.code_order,
              payment_total: this.props.orderSelected.amount_2
            })
          }} />
      );
    }
  }


  renderMoreButton() {
    let DownloadQuotation = (this.props.orderSelected.status != 'ORDER') ?
      (<Button
        backgroundColor="#6bc3cd"
        loading={this.state.downloadQuotation}
        title={this.state.downloadQuotation ? ' ' : 'Download Quotation'}
        disabled={this.state.downloadQuotation}
        buttonStyle={{ marginBottom: 10 }}
        disabledStyle={{
          backgroundColor: "#84dde8"
        }}
        onPress={() => {
          this.setState({
            downloadQuotation: true
          });
          setTimeout(() => {
            Global.presentToast("Downloading ..");
            Global.downloadFile(Global.getBaseUrl() + "customer/generate-quotation/" + this.props.orderSelected.id).then(res => {
              this.setState({
                downloadQuotation: false
              });
              console.log(res);
              Global.presentToast("Success");
            })
              .catch(err => {
                this.setState({
                  downloadQuotation: false
                });
              });
          }, 1000);
        }} />)
      :
      null;

    let UploadPurchaseOrder = (this.props.orderSelected.status != 'ORDER' && this.props.orderSelected.status != 'QUOTATION' && this.props.orderSelected.file_po == '') ?
      (<Button
        backgroundColor="#ff4545"
        title={this.state.uploadPo ? ' ' : 'Upload Purchase Order'}
        disabled={this.state.uploadPo}
        loading={this.state.uploadPo}
        disabledStyle={{
          backgroundColor: "#ff4545"
        }}
        buttonStyle={{ marginBottom: 10 }}
        onPress={() => this.showActionSheetUploadPO()} />)
      :
      null;

    let DownloadPurchaseOrder = (this.props.orderSelected.status != 'ORDER' && this.props.orderSelected.status != 'QUOTATION' && this.props.orderSelected.file_po != '') ?
      (<Button
        backgroundColor="#6bc3cd"
        loading={this.state.downloadPo}
        title={this.state.downloadPo ? ' ' : 'Download Purchase Order'}
        disabled={this.state.downloadPo}
        disabledStyle={{
          backgroundColor: "#84dde8"
        }}
        buttonStyle={{ marginBottom: 10 }}
        onPress={() => {
          this.setState({
            downloadPo: true
          });
          setTimeout(() => {
            Global.presentToast("Downloading ..");
            


            Global.downloadFile(Global.getBaseUrl() + "backend/uploads/PO/" + this.state.cekFileValue).then(res => {
              console.log("Url Download PO: "+Global.getBaseUrl() + "backend/uploads/PO/" + this.state.cekFileValue)
              console.log("File PDF: "+ this.state.cekFileValue)
              this.setState({
                downloadPo: false
              });
              console.log(res);
              Global.presentToast("Success");
            })
              .catch(err => {
                console.log(err);
                this.setState({
                  downloadPo: false
                });
              });
          }, 1000);
        }} />)
      :
      null;

    let DownloadInvoice1 = (this.props.orderSelected.status != 'ORDER' && this.props.orderSelected.status != 'QUOTATION' && this.props.orderSelected.status != 'PO' && this.props.orderSelected.status_file == 1) ?
      (<Button
        backgroundColor="#6bc3cd"
        loading={this.state.downloadInvoice}
        title={this.state.downloadInvoice ? ' ' : 'Download Invoice'}
        disabled={this.state.downloadInvoice}
        disabledStyle={{
          backgroundColor: "#84dde8"
        }}
        buttonStyle={{ marginBottom: 10 }}
        onPress={() => {
          this.setState({
            downloadInvoice: true
          });
          setTimeout(() => {
            Global.presentToast("Downloading ..");
            Global.downloadFile(Global.getBaseUrl() + "backend/uploads/invoice/" + this.props.orderSelected.file_invoice).then(res => {
              this.setState({
                downloadInvoice: false
              });
              console.log(res);
              Global.presentToast("Success");
            })
              .catch(err => {
                this.setState({
                  downloadInvoice: false
                });
              });
          }, 1000);
        }} />)
      :
      null;

    let DownloadInvoice2 = ((this.props.orderSelected.status == 'INVOICE_2' && this.props.orderSelected.file_invoice_2 != '') || this.props.orderSelected.status == 'CONFIRM_PAYMENT_2') ?
      (<Button
        backgroundColor="#6bc3cd"
        loading={this.state.downloadInvoice2}
        title={this.state.downloadInvoice2 ? ' ' : 'Download Invoice 2'}
        disabled={this.state.downloadInvoice2}
        disabledStyle={{
          backgroundColor: "#84dde8"
        }}
        buttonStyle={{ marginBottom: 10 }}
        onPress={() => {
          this.setState({
            downloadInvoice2: true
          });
          setTimeout(() => {
            Global.presentToast("Downloading ..");
            Global.downloadFile(Global.getBaseUrl() + "backend/uploads/invoice/" + this.props.orderSelected.file_invoice_2).then(res => {
              this.setState({
                downloadInvoice2: false
              });
              console.log(res);
              Global.presentToast("Success");
            })
              .catch(err => {
                this.setState({
                  downloadInvoice2: false
                });
              });
          }, 1000);
        }} />)
      :
      null;

    return (
      <View>
        {this.renderConfirmPayment()}
        {DownloadQuotation}
        {UploadPurchaseOrder}
        {DownloadPurchaseOrder}
        {DownloadInvoice1}
        {DownloadInvoice2}
      </View>
    );
  }

  renderTimeline() {
    return (
      <View>
        <Timeline
          style={styles.list}
          data={this.props.orderSelected.status_list}
          circleSize={20}
          scrollEnabled={false}
          innerCircle={"dot"}
          circleStyle={{
            marginTop: 10
          }}
          renderTime={this.timelineRenderTime}
          enableEmptySections={true}
          options={{
            enableEmptySections: true,
            removeClippedSubviews: false,
            style: { paddingTop: 5 }
          }}
          titleStyle={{
            marginTop: -10
          }}
        />
        {this.renderMoreButton()}
        <View style={{ flex: 1, paddingLeft: 16, paddingRight: 16 }}>
          <ListItem
            key={1}
            title={'Order Details'}
            hideChevron
          />
        </View>

      </View>
    );
  }

  getGrandTotal() {
    if (this.props.orderSelected.status != 'ORDER') {
      return this.props.orderSelected.shopping_total;
    }

    return '0';
  }

  renderFooter() {
    if (this.props.orderSelected.status == 'ORDER') {
      return;
    }
    let GrandTotal = (
      <View style={{ padding: 16 }}>
        <View style={{ padding: 16, backgroundColor: '#e2e2e2' }}>
          <Text style={{ fontWeight: 'bold' }}>Grand Total: {Global.getFormattedCurrency(this.getGrandTotal())}</Text>
        </View>
      </View>
    );

    return (
      <View>
        {GrandTotal}
      </View>
    );
  }

  renderWip(wip) {
    let downloadButton = <Text style={styles.contentTitleStyle}>-</Text>;
    if (wip.file != null) {
      downloadButton = (
        <View style={{
          flex: 1, alignItems: 'flex-end'
        }}>
          <Button
            backgroundColor="#6bc3cd"
            title={'Download'}
            disabledStyle={{
              backgroundColor: "#84dde8"
            }}
            buttonStyle={{
              backgroundColor: "#6bc3cd",
              width: 100,
              height: 15,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5,
            }}
            onPress={() => {
              Global.presentToast("Downloading ..");
              setTimeout(() => {
                Global.downloadFile(Global.getBaseUrl() + "backend/uploads/wip/" + wip.file).then(res => {
                  alert('Download Success');
                  showMessage({
                    message: 'Download Success',
                    type: 'success'
                  });
                })
                  .catch(err => {
                  });
              }, 1000);
            }} />
        </View>
      );
    }
    return (
      <View style={styles.contentContainerStyle}>
        <Text style={styles.contentLabelStyle}>DO Number</Text>
        <Text style={styles.contentTitleStyle}>{wip.code}</Text>
        <Text style={styles.contentLabelStyle}>Delivery Courier</Text>
        <Text style={styles.contentTitleStyle}>{wip.code}</Text>
        <Text style={styles.contentLabelStyle}>Delivery Date</Text>
        <Text style={styles.contentTitleStyle}>{moment(wip.time).format('DD MMM YYYY')}</Text>
        <Text style={styles.contentLabelStyle}>Qty</Text>
        <Text style={styles.contentTitleStyle}>{wip.jumlah}</Text>
        <Text style={styles.contentLabelStyle}>Notes</Text>
        <Text style={styles.contentTitleStyle}>{wip.note != '' ? wip.note : '-'}</Text>
        <Text style={styles.contentLabelStyle}>Bukti Pengiriman</Text>
        {downloadButton}
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 10 }} />
      </View>
    );
  }

  render() {
    return <View style={styles.container}>
        <FlatList
          data={this.props.orderSelected.order_details}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)} />
          }
          renderItem={({ item }) => this.renderProductItem(item)}
          ListHeaderComponent={this.renderTimeline()}
          ListFooterComponent={this.renderFooter()}
          removeClippedSubviews={false}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <Header
            backgroundColor="#FFFFFF"
            containerStyle={{
              backgroundColor: '#FFFFFF',
              justifyContent: 'space-around',
            }}
            leftComponent={
              <TouchableOpacity onPress={() => {
                console.log(this.state.wips);
                this.setModalVisible(!this.state.modalVisible);
              }}>
                <Text style={{ fontSize: 14 }}>Close</Text>
              </TouchableOpacity>
            }
            centerComponent={{ text: this.state.deliveryOrderName, style: { color: '#000', fontSize: 14 } }}
          />
          <View style={{
            flex: 1,
            padding: 16
          }}>
            <FlatList
              data={this.state.wips}
              renderItem={({ item }) => this.renderWip(item)}
            />
          </View>
        </Modal>
      </View>;
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  list: {
    flex: 1,
    padding: 16,
    paddingBottom: 0
  },
  accordionHeaderStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingRight: 15,
    paddingLeft: 15,
    paddingBottom: 15,
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2'
  },
  contentLabelStyle: {
    paddingBottom: 5,
    color: '#000000',
    fontWeight: 'bold'
  },
  contentTitleStyle: {
    paddingBottom: 5,
    color: '#a5a5a5',
    textAlign: 'right'
  },
  contentContainerStyle: {
    display: 'flex',
    backgroundColor: '#e2e2e2',
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15,
  }
});

const mapStateToProps = state => {
  return {
    user: state.user.user,
    isLoggedIn: state.user.isLoggedIn,
    orderSelected: state.orders.orderSelected,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateOrder: (order) => dispatch(updateOrder(order)),
    onUnsetUser: () => dispatch(unsetUser())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderStatusDetail);