/**
 * @author licong
 * @date 2019-04-02
 * @Description: 公用请求封装
 */
import axios from 'axios';
import qs from 'qs';
import {Auth} from '@essence/tifa';
import untilsObj from './utils';
import {showLoading, closeLoading} from './utils/httploading';

class HttpClient {
  constructor (requestObj, vueContent) {
    this.curVueContent = vueContent;
    this.requestObj = requestObj;
    this.LogInJyUrl = '/mobileHall/unified/login.do'; // 登录交易权限Url
    // 登录E帐通权限Url /scoreMarket/eShop/appNewLogin.do
    this.logInEztUrl = '';
    this.generateTokenUrl = '/mobileHall/user/h5/generateToken.do'; // 登录后获取token
    this.sendQuery();
  }

  /**
   * 建立XMLHTTP请求
   */
  sendQuery () {
    let setting = {
      // 自定义参数，成功回调函数，默认打印值
      fnSuc: (response) => {
        console.log(response);
      },
      // 自定义参数，失败回调函数，默认弹窗
      fnErr: () => {
        this.curVueContent.$alert('网络似乎是不通的');
      },
      // 自定义参数，是否需要在请求成功之后调用其他方法
      logTimeOutFn: null,
      // 自定义参数，是否需要单独处理特定错误码，默认不处理
      BlockErr: false,
      // 自定义参数，是否需要单独处理一切错误码，默认不处理
      everyErr: false,
      // 自定义参数，loading是否展示
      showLoading: true,
      // `dealRespons` 默认为新的标准返回体，如果要使用旧的处理返回体请传入string 'old'
      dealResponse: 'standard',
      // `activatePhoneNumber`如果需要E帐通token时默认需要触发绑定手机号流程
      activatePhoneNumber: 1,
      // `url` 是用于请求的服务器 URL
      url: '', // 请求地址 必传
      // `method` 是创建请求时使用的方法
      method: 'post', // 默认是 post
      // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
      // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
      baseURL: '',
      // `headers` 是即将被发送的自定义请求头
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'token': localStorage && localStorage.localToken ? localStorage.localToken : ''
      },
      // `params` 是即将与请求一起发送的 URL 参数
      // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
      params: {},
      // `data` 是作为请求主体被发送的数据
      // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
      // 在没有设置 `transformRequest` 时，必须是以下类型之一：
      // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
      // - 浏览器专属：FormData, File, Blob
      // - Node 专属： Stream
      data: {},
      // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
      // 如果请求会话了超过 `timeout` 的时间，请求将被中断
      // timeout: 5000,
      // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
      responseType: 'json', // 默认的
      // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
      xsrfCookieName: 'XSRF-TOKEN', // default
      // `xsrfHeaderName` 是承载 xsrf token 的值的 HTTP 头的名称
      xsrfHeaderName: 'X-XSRF-TOKEN', // 默认的
      // `onUploadProgress` 允许为上传处理进度事件
      onUploadProgress: progressEvent => {
        // 对原生进度事件的处理
      },
      // `onDownloadProgress` 允许为下载处理进度事件
      onDownloadProgress: progressEvent => {
        // 对原生进度事件的处理
      },
      // `maxContentLength` 定义允许的响应内容的最大尺寸
      maxContentLength: 2000,
      // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
      validateStatus: status => {
        return status >= 200 && status < 300; // 默认的
      },
      // `maxRedirects` 定义在 node.js 中 follow 的最大重定向数目
      // 如果设置为0，将不会 follow 任何重定向
      maxRedirects: 5 // 默认的
    };
    for (let x in setting) {
      if (this.requestObj.hasOwnProperty(x)) {
        if (x === 'headers') {
          // setting[x] = {...this.requestObj[x], ...setting[x]};
          setting[x] = {...setting[x], ...this.requestObj[x]};
        } else {
          setting[x] = this.requestObj[x];
        }
      }
    }
    this.requestObj = setting;
    if (typeof setting.data === 'object') {
      setting.data = qs.stringify(setting.data);
    }
    // 添加请求拦截器
    axios.interceptors.request.use((config) => {
      // 在发送请求之前做些什么
      if (config.showLoading) {
        showLoading(this.curVueContent);
      }
      return config;
    }, (error) => {
      // 对请求错误做些什么
      return Promise.reject(error);
    });

    // 添加响应拦截器
    axios.interceptors.response.use((response) => {
      // 对响应数据做点什么
      closeLoading(this.curVueContent);
      return response;
    }, (error) => {
      closeLoading(this.curVueContent);
      // 对响应错误做点什么
      return Promise.reject(error);
    });

    axios(setting)
      .then((response) => {
        this.dealSucess(response);
      })
      .catch((error) => {
        if (error.response) {
          // 网络层面接口异常
          this.requestObj.fnErr(error);
        } else {
          // then方法里面捕获的异常
          console.error(error);
        }
      });
  }

  /**
   * 接收并处理返回体
   * @param response 响应对象
   */
  dealSucess (response) {
    // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 304 || response.status === 400 || response.status === 0)) {
      let res = response.data;
      let dealResponseType = this.requestObj.dealResponse;
      if (res === '' || res === null || res === undefined) {
        this.curVueContent.$alert('服务器响应超时');
        return false;
      }
      // 除数据异常，忽略一切错误码执行回调函数
      if (this.requestObj.everyErr) {
        this.requestObj.fnSuc && this.requestObj.fnSuc(res);
        return false;
      }

      if (dealResponseType === 'old') {
        // 如果按原有的返回体，需要传入dealRespons为'old'
        // 返回数据各自项目在dealResponseOld方法中编写
        this.dealResponseOld(response);
      } else if (dealResponseType === 'standard') {
        // 默认为移动应用开发组后端返回体标准规范
        this.dealResponse(response);
      }
    } else {
      // 异常状态下，把错误信息返回去
      this.curVueContent.$alert(response.statusText);
    }
  }

  /**
   * 解析后端返回体，根据各自项目的具体老接口进行编写(这里为积分商城的返回体)
   * @param response 响应对象
   */
  dealResponseOld (response) {
    let data = response.data;
    // 兼容原来提示返回字段之间的不兼容问题统一命名
    let nErrorNO = '', sErrorMessage = '';
    // 老接口返回的数据需要转换为json对象，新接口不用
    // if (!((typeof data == 'string') && data.constructor == String)) {
    //   data = JSON.parse(data);
    // }
    if (data) {
      // 统一参数后台返回参数的命名规则 新添加的接口 有code这个字段
      if (data.code != null) {
        sErrorMessage = data.message;
        nErrorNO = data.code;
      } else {
        if (data.errorMessage) {
          sErrorMessage = data.errorMessage;
        } else {
          sErrorMessage = data.ERRORMESSAGE;
        }
        if (data.errorCode) {
          nErrorNO = data.errorCode;
        } else {
          nErrorNO = data.ERRORNO;
        }
      }

      // 登录超时或未登录
      if (nErrorNO === -3) {
        if (untilsObj.isAnXinApp()) {
          this.getJyToken();
        } else {
          this.webLogIn();
        }
        return;
      }

      // 登录成功的唯一标示状态
      if (nErrorNO === 0 || nErrorNO === 1 || nErrorNO === '00') {
        this.requestObj.fnSuc(data);
      } else {
        if (this.requestObj.BlockErr) {
          this.requestObj.fnSuc && this.requestObj.fnSuc(data);
          return false;
        }
        this.curVueContent.$alert(sErrorMessage);
      }
    }

    // 下面为理财系统老返回体
    // if (res.data.errcode === -1 || res.data.errcode === -9) {
    //   // 拦截器拦截未登录
    //   if (untilsObj.isAnXinApp()) {
    //     this.getJyToken();
    //   } else {
    //     this.webLogIn();
    //   }
    //   return;
    // }
    // if (res.data.errcode === 0) {
    //   // 返回成功,执行成功回调
    //   this.requestObj.fnSuc(res);
    // } else {
    //   // 如果BlockErr这个参数为true，屏蔽其他错误提示，在成功函数里处理不同错误逻辑
    //   if (this.requestObj.BlockErr) {
    //     this.requestObj.fnSuc && this.requestObj.fnSuc(res);
    //     return false;
    //   }
    //   this.curVueContent.alert(res.data.errmsg);
    // }
  }

  /**
   * 移动应用开发组标准返回体处理
   * @param response 响应对象
   */
  dealResponse (response) {
    let res = response.data;
    if (res.code === 101 || res.code === 102 || res.code === 103) {
      // 后端接口统一鉴权专用错误码
      if (!untilsObj.isAnXinApp()) {
        // app外部进行网页登录
        this.webLogIn();
        return;
      }

      if (res.code === 103) {
        // 1003状态码获取交易权限token
        this.getJyToken();
      } else if (res.code === 101 || res.code === 102) {
        // 101 102分别是获取E帐通token,和强刷E帐通token
        let requestToken = res.code === 101 ? 0 : 1;
        this.getEztToken(requestToken);
      }

      return false;
    }

    if (res.code < 0) {
      // 不可挽回报错弹框，前端只负责报错弹出message,不处理任何逻辑操作
      this.curVueContent.$alert(res.message);
      return;
    }
    if (res.code === 0) {
      // 返回成功,执行成功回调
      this.requestObj.fnSuc(res);
    } else {
      // 如果BlockErr这个参数为true，屏蔽其他错误提示，在成功函数里处理不同错误逻辑
      if (this.requestObj.BlockErr) {
        this.requestObj.fnSuc && this.requestObj.fnSuc(res);
      } else {
        this.curVueContent.$alert(res.message);
      }
    }
  }

  /**
   *获取E帐通权限token
   * @param requestToken: 0不强刷token 1为强刷token
   */
  getEztToken (requestToken = '0') {
    if (untilsObj.isTifaWebView()) {
      Auth.getToken({
        loginType: '0',
        requestToken,
        isNeedLogin: '1',
        activatePhoneNumber: this.requestObj.activatePhoneNumber,
        callback: (res) => {
          if (res.token) {
            this.appLogInEzt(res.token);
          }
        }
      });
      return;
    }
    // 中卓webview获取E帐通token
    window.getToken = res => {
      if (res.token) {
        this.appLogInEzt(res.token);
      }
    };
    window.loseLogIn = res => {
      closeLoading(this.curVueContent);
      getToken(res);
    };
    if (requestToken === 0) {
      untilsObj.changeURL('http://action:57600/?callback=getToken&&skipLogin=yes');
    } else if (requestToken === 1) {
      // e帐通登录失效,强刷token
      showLoading(this.curVueContent); // 强刷前手动加上loading,防止强刷过程中用户反复点击，loading中断
      untilsObj.changeURL('http://action:57600/?callback=loseLogIn&&skipLogin=yes&&requestToken=yes');
    }
  }

  /**
   * 获取交易token
   * @param getJyType string 通过什么方式获取交易token
   * 不传默认为 不同登录获取token,不强拉登录框，不强刷token
   * 'forceTradeLogin' 强拉交易登录框后再获取token
   * 'requestToken' 强刷获取token
   */
  getJyToken (getJyType) {
    if (untilsObj.isTifaWebView()) {
      Auth.getToken({
        loginType: '1',
        isNeedLogin: '1',
        forceTradeLogin: getJyType === 'forceTradeLogin' ? '1' : '0',
        requestToken: getJyType === 'requestToken' ? '1' : '0',
        callback: (res) => {
          if (res.token) {
            this.appLogInJy(res.token);
          }
        }
      });
      return;
    }
    if (getJyType === 'forceTradeLogin') {
      // 需要拉起交易登录框 并且登录成功后才能再次获取token
      window.refreshBack = res => {
        if (res.isSuccess === 'true') {
          this.getJyToken();
        }
      };
      untilsObj.changeURL('http://action:57615/?callback=refreshBack');
      return;
    }

    // 下面为中卓webview获取token方法
    window.getTimeOutToken = res => {
      // 1. 已经登录基础交易，并且有token。调用login.do;
      if (res.isJCTradeLogin === 'yes' && res.token) {
        this.appLogInJy(res.token);
        return;
      }
      // 2. E账通登录，基础交易没有登录，调用10090拉起交易登录成功后 ，回调 57605再拿token
      if (res.isJCTradeLogin === 'no' && res.token) {
        window.loginBack = () => {
          this.getJyToken();
        };
        untilsObj.changeURL('http://action:10090/?loginkind=1&&jsfuncname=loginBack()');
      }
      // 下面两种情况不做处理
      // 如果 （isJCTradeLogin == yes && token为空）---->异常状况不作处理
      // 如果 （isJCTradeLogin == no && token为空） ----->组合登录界面取消登录回调
    };
    let getTokenUrl = 'http://action:57605/?callback=getTimeOutToken&&skipLogin=yes';
    if (getJyType === 'requestToken') {
      // 强刷token获取token的中卓链接
      getTokenUrl = 'http://action:57605/?callback=getTimeOutToken&&requestToken=yes&&skipLogin=yes';
    }
    untilsObj.changeURL(getTokenUrl);
  }

  /**
   * app拿到E帐通token后传给web后端，同步登陆状态
   * acessToken: 从Native取过来的token
   */
  appLogInEzt (acessToken) {
    new HttpClient({
      url: this.logInEztUrl,
      data: {accessToken: acessToken},
      dealResponse: this.requestObj.dealResponse,
      fnSuc: oData => {
        if (this.requestObj.logTimeOutFn) {
          // 登录成功后的传入回调
          this.requestObj.logTimeOutFn(oData);
          return;
        }
        // 登录接口，成功后不能继续上一步登录操作
        if (this.requestObj.url === this.logInEztUrl) {
          this.requestObj.fnSuc(oData);
          return;
        }
        new HttpClient(this.requestObj, this.curVueContent);
      }
    }, this.curVueContent);
  }

  /**
   * 同步交易登录态交易登录接口
   * @param acessToken
   */
  appLogInJy (acessToken) {
    new HttpClient({
      url: this.LogInJyUrl,
      data: {accessToken: acessToken},
      everyErr: true,
      dealResponse: this.requestObj.dealResponse,
      fnSuc: oData => {
        // 移动应用开发组标准后端返回体，处理交易登录接口
        if (this.requestObj.dealResponse === 'standard') {
          if (oData.code === 104 || oData.code === 105 || oData.code === 106) {
            // 需要拉起交易登录框重新登录后再获取token
            this.getJyToken('forceTradeLogin');
            return;
          }
          if (oData.code === 107) {
            // 需要强刷token
            this.getJyToken('requestToken');
            return;
          }
          if (oData.code === 0) {
            // 登录成功
            if (this.requestObj.logTimeOutFn) {
              // 登录成功后的传入回调
              this.requestObj.logTimeOutFn(oData);
              return;
            }
            // 登录接口，成功后不能继续上一步登录操作
            if (this.requestObj.url === this.LogInJyUrl) {
              this.requestObj.fnSuc(oData);
              return;
            }
            new HttpClient({
              url: this.generateTokenUrl,
              fnSuc: (res) => {
                if (res.data.token) {
                  localStorage.setItem('localToken', datas.data.token);
                  new HttpClient(this.requestObj, this.curVueContent);
                }
              }
            }, this.curVueContent);
          } else {
            // 登录接口报其他错误
            this.curVueContent.$alert(this.curVueContent.message);
          }
        } else {
          // 衍生版本，自定义返回状态吗
          this.oldJyDealLogInResponse(oData);
        }
      }
    }, this.curVueContent);
  }

  /**
   * 处理登录交易权限得登录接口的层级关系,下面为理财老接口登录返回体
   * @param oData 为登录接口返回的状态码
   */
  oldJyDealLogInResponse (oData) {
    if (oData.state === 200) {
      let errCode = oData.data.errcode;
      if (errCode === 500101 || errCode === 500102 || errCode === 500105 || errCode === 500106) {
        // 需要拉起交易登录框重新登录后再获取token
        this.getJyToken('forceTradeLogin');
        return;
      }
      if (errCode === 0) {
        // 登录成功
        if (this.requestObj.logTimeOutFn) {
          // 登录成功后的传入回调
          this.requestObj.logTimeOutFn(oData);
          return;
        }
        // 登录接口，成功后不能继续上一步登录操作
        if (this.requestObj.url === this.LogInJyUrl) {
          this.requestObj.fnSuc(oData);
          return;
        }
        // 登录成功后请求generateToken并放入localStorage，继续上一步操作
        new HttpClient({
          url: this.generateTokenUrl,
          fnSuc: (res) => {
            if (res.token) {
              localStorage.setItem('localToken', res.token);
              new HttpClient(this.requestObj, this.curVueContent);
            }
          },
          dealResponse: 'old'
        }, this.curVueContent);
      } else {
        this.curVueContent.$alert(this.curVueContent.message);
      }
    } else if (oData.state === 500106) {
      this.getJyToken('requestToken');
    } else {
      this.curVueContent.$alert(oData.state + '/' + oData.message);
    }
  }

  webLogIn () {
    // app外部的未登录逻辑
    this.curVueContent.$confirm({
      message: '您未登录或登录超时，请重新登录',
      rightButton: '登录'
    }).then(res => {
      if (res) {
        // 点击确定 按钮的回调
        window.location.replace('/logIn.html?backUrl=' + encodeURIComponent(location.href));
      } else {
        // 点击取消按钮的回调
        window.history.go(-1);
      }
    });
  }
}

export default function (requestObj, vueContent) {
  return new HttpClient(requestObj, vueContent);
}
