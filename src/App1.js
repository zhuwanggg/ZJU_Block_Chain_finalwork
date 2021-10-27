import React from "react";
import { Image,Row, Col, Layout, Button, Radio, Space, Table, Progress, Modal, Form, Input, InputNumber, DatePicker, Divider, List, message, Spin, Tag, Tooltip, Descriptions } from 'antd';
import web3 from './utils/InitWeb3';
import NFTInstance from './solc_file/NFT_market';
const { Header, Content, Footer } = Layout;
const { TextArea } = Input;

const openSuccessMessage = (text) => {
    message.success(text);
  }
  const openFailureMessage = (text) => {
    message.error(text);
}
const LaunchForm = (props) => {
    const [form] = Form.useForm();
  
    const onFinish = (values) => {
      props.onClick(values.name, values.img_link, values.price)
    };
  
    const onReset = () => {
      form.resetFields();
    };
  
    return (
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="img_link" label="图片链接" rules={[{ required: true }]}>
          <TextArea />
        </Form.Item>
        <Form.Item name="price" label="价格" rules={[{ required: true }]}>
          <InputNumber min={1}/>
        </Form.Item>
        {/* <Form.Item name="deadline" label="上架日期" rules={[{ required: true }]}>
          <DatePicker type="date" />
        </Form.Item> */}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              上传完成
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置所有选项
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };
  
const truncate = (num) => Math.floor(100*num)/100

const BasicInfo = (props) => {
    const tag = (props.situation !== "1"
      ? <Tag color="processing">售卖中</Tag>
      : <Tag color="error">已经卖出</Tag>
    )
    return (
      <>
        <Divider orientation="left">基本信息</Divider>
        <Descriptions bordered size="small" column={1}>
          <Descriptions.Item label="名称">{props.name}</Descriptions.Item>
          <Descriptions.Item label="状态">{tag}</Descriptions.Item>
          <Descriptions.Item label="价格">{props.price}</Descriptions.Item>
          <Descriptions.Item label="地址">{props.address}</Descriptions.Item>
          <Descriptions.Item label="出售者">{props.seller}</Descriptions.Item>
          {/* <Descriptions.Item label="集资进度">{`${props.currentAmount} ETH/${props.totalAmount} ETH`}</Descriptions.Item>
          <Descriptions.Item label="我的投资额度">{props.investAmount} ETH</Descriptions.Item> */}
          {/* <Descriptions.Item label="到期时间">{(new Date(props.deadline * 1000)).toLocaleDateString()}</Descriptions.Item> */}
          <Descriptions.Item label="作品访问链接">{props.img_link}</Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">作品展示</Divider>
        <Image
          width={200}
          src={props.img_link}
        />
      </>
    )
  }
  class BuyView extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        amount: 1
      }
    }
    render() {
      const maxAmount = this.props.price
      return (
        <>
          <Divider orientation="left">购买</Divider>
            <Button
              type="primary"
              onClick={() => this.props.buy(this.props.idx, maxAmount)}
            >
              购买
            </Button>
        </>
      )
    }
  }



class DetailPage extends React.Component {
    render() {
      const finished = (this.props.situation === 1)
      console.log(this.props.situation)
      return (
        <>
          <BasicInfo {...this.props}/>
          {!finished && <BuyView {...this.props}/>}
        </>
      )
    }
  }


export default class App1 extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        currentAccount: '未登录的游客',
        rawData: [],
        shownData: [],
        isuploadVisible: false,
        isDetailVisible: false,
        columns: [
          {
            title: 'NFT名称',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '销售者',
            dataIndex: 'seller',
            key: 'seller',
          },
          {
            title: '是否卖出',
            key: 'progress-money',
            render: (text, record) => (
              <Progress percent={truncate(100*record.situation)}></Progress>
            )
          },
          {
            title: '详细情况',
            key: 'detail',
            render: (text, record) => (
              <Button onClick={() => this.openDetailView(record.key)}>查看详情</Button>
            ),
          },
        ],
        detail: {},
        requests: [],
        loading: true,
      }
      // this.openDetailView = this.openDetailView.bind(this)
      this.changeShownData = this.changeShownData.bind(this)
      this.upload = this.upload.bind(this)
      this.buy = this.buy.bind(this)
    }
  
    async componentDidMount() {
      let accounts = await web3.eth.getAccounts()
      let counts = await NFTInstance.methods.getmarketsCount().call()
      let rawData = []
      for(let i = 0;i < counts;i++) {
        let key = i;
        let name = await NFTInstance.methods.getNFTName(i).call()
        let address = await NFTInstance.methods.getNFTAddress(i).call()
        let seller = await NFTInstance.methods.getNFTseller(i).call()
        let price = await NFTInstance.methods.getNFTprice(i).call()
        // let price = web3.utils.fromWei(priceWei, 'ether');
        let buyer = await NFTInstance.methods.getNFTbuyer(i).call()
        let situation = await NFTInstance.methods.getNFTsituation(i).call()
        let img_link = await NFTInstance.methods.getNFTlink(i).call()
        rawData.push({
          key: key,
          idx: key,
          name: name,
          address: address,
          seller: seller,
          price: price,
          buyer: buyer,
          situation: situation,
          img_link: img_link
        })
      }
      this.setState({
        currentAccount: accounts[0],
        rawData: rawData,
        shownData: rawData,
        loading: false
      })
    }
  
    async upload(name, img_link, price) {
      const currentAccount = this.state.currentAccount;
      try {
          await NFTInstance.methods.upload(name, img_link, price).send({
            from: currentAccount,
            gas: '3000000',
          })
          openSuccessMessage("发布成功")
          window.location.reload()
      } catch (e) {
          openFailureMessage("发布失败")
          console.log(e)
      }
    }
  
    async buy(key, amount) {
      const currentAccount = this.state.currentAccount
      try {
        await NFTInstance.methods.buy(key).send({
          from: currentAccount,
          value: web3.utils.toWei(amount.toString(),'ether'),
          gas: '3000000'
        })
        openSuccessMessage("购买成功")
        window.location.reload()
      } catch(e) {
        console.log(e)
        openFailureMessage("购买失败")
      }
    }

    async openDetailView(key) {
      this.setState((state) => ({
        detail: state.rawData[key],
      }))
      this.setState({isDetailVisible: true});
    }
  
    changeShownData(tag) {
      const rawData = this.state.rawData;
      const currentAccount = this.state.currentAccount;
      if(tag === "所有NFT") {
        this.setState({shownData: rawData})
      } else if(tag === "我上传的NFT") {
        this.setState({shownData: rawData.filter(item => item.seller === currentAccount)})
      } else if(tag === "我购买的NFT") {
        this.setState({shownData: rawData.filter(item => item.buyer === currentAccount)})
      } else if(tag === "未出售的NFT") {
        this.setState({shownData: rawData.filter(item => item.situation !== "1")})
      }
    }
  
    render() {
      return (
        <Layout className="layout" style={{height: "100vh"}}>
          <Header>
            <Row>
              <Col span={6}><img src="../src/a.jpg" alt="" /></Col>
              <Col span={6}></Col>
              <Col span={6}></Col>
              <Col span={4}></Col>
              <Col span={2} style={{margin: "auto"}}><Button type="primary" style={{visibility: this.state.loading ? "hidden" : "visible"}} onClick={() => this.setState({isuploadVisible: true})}>上传NFT</Button></Col>
            </Row>
          </Header>
          <Content style={{overflow:"auto", padding: "20px 20px"}}>
            <Spin spinning={this.state.loading} size="large">
              <Modal
                title="上传NFT"
                visible={this.state.isuploadVisible}
                footer={null}
                onCancel={() => {this.setState({isuploadVisible:false})}}
              >
                <LaunchForm onClick={this.upload}/>
              </Modal>
              <Modal
                title="NFT详情"
                visible={this.state.isDetailVisible}
                footer={null}
                width="600px"
                onCancel={() => {this.setState({isDetailVisible:false})}}
              >
                <DetailPage 
                  {...this.state.detail}
                  buy = {this.buy}
                  currentAccount={this.state.currentAccount}
                />
              </Modal>
              <p>{this.state.currentAccount}: 欢迎使用NFT_Market！</p>
              <Radio.Group size="large" onChange={e => this.changeShownData(e.target.value)} defaultValue="所有NFT">
                <Radio.Button value="所有NFT">所有NFT</Radio.Button>
                <Radio.Button value="我上传的NFT">我上传的NFT</Radio.Button>
                <Radio.Button value="我购买的NFT">我购买的NFT</Radio.Button>
                <Radio.Button value="未出售的NFT">未出售的NFT</Radio.Button>
              </Radio.Group>
              <Table columns={this.state.columns} dataSource={this.state.shownData} pagination={{pageSize: 8}} />
            </Spin>
          </Content>
          <Footer style={{ backgroundColor: "rgba(0, 0, 0, 0.85)", color: "white", textAlign: 'center' }}>NFT_Market ©2021 Created by ZhuWanggg</Footer>
        </Layout>
      )
    }
  };
  