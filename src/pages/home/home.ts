import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { CodePush } from '@ionic-native/code-push';

// CodePushのキー
const CODE_PUSH_IOS_KEY       = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const CODE_PUSH_ANDROID_KEY   = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  // 進捗を画面に表示するための変数
  log = '';

  constructor(
    private platform: Platform,
    private codePush: CodePush,
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.init();
    });
  }

  /**
   * Ionicアプリが準備できた段階で呼ばれる初期化処理
   */
  private init() {
    // アプリ再開を監視
    this.platform.resume.subscribe(() => {
      this.checkAndUpdate();
    });

    // アプリ起動時の同期
    this.checkAndUpdate();
  }

  /**
   * CodePushのアップデート
   */
  private async checkAndUpdate() {
    this.putLog('CodePush.sync() 開始');

    const deploymentKey = this.getDeploymentKey();
    this.codePush.sync({
      deploymentKey: deploymentKey,
    }).subscribe(status => {
      this.putLog(`SyncStatus = ${status}`);
    }, error => {
      this.putLog(`Error = ${error}`);
    });
  }

  /**
   * OSに応じたCodePushのキー
   * @return CodePushのキー
   */
  private getDeploymentKey(): string {
    if (this.platform.is('ios')) {
      return CODE_PUSH_IOS_KEY;
    } else if (this.platform.is('android')) {
      return CODE_PUSH_ANDROID_KEY;
    }

    throw new Error('Not supported platform.');
  }

  /**
   * OSに応じたCodePushのキー
   * @param body 出力するログ
   */
  private putLog(body: string) {
    this.log += `${body}<br>`;
  }
}

