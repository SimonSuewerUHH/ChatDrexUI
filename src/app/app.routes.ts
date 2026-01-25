import {Routes} from '@angular/router';
import {PaperChatWindowComponent} from './modules/chat/components/paper-chat-window/paper-chat-window.component';
import {IntroductionComponent} from './modules/base/components/introduction/introduction.component';
import {
  IntroductionWrapperComponent
} from './modules/base/components/introduction-wrapper/introduction-wrapper.component';
import {FaqComponent} from './modules/base/components/faq/faq.component';
import {ChatWelcomeComponent} from './modules/chat/components/chat-welcome/chat-welcome.component';
import {ChatWrapperComponent} from './modules/chat/components/chat-wrapper/chat-wrapper.component';
import {IntroductionToolsComponent} from './modules/base/components/introduction-tools/introduction-tools.component';
import {StartPageComponent} from './modules/base/components/start-page/start-page.component';

export const routes: Routes = [
  {
    path: '',
    component: StartPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'introduction',
    component: IntroductionWrapperComponent,
    children: [
      {
        path: '',
        component: IntroductionComponent,
      },
      {
        path: 'home',
        component: IntroductionComponent,
      },
      {
        path: 'faq',
        component: FaqComponent,
      },
      {
        path: 'tools',
        component: IntroductionToolsComponent,
      }
    ],
  },
  {
    path: 'chat',
    component: ChatWrapperComponent,
    children: [
      {
        path: '',
        component: PaperChatWindowComponent,
        data: {breadcrumb: 'Chat'},
      },
      {
        path: 'new',
        component: ChatWelcomeComponent,
        data: {breadcrumb: 'Chat'},
        pathMatch: 'full',
      },
      {
        path: ':threadId',
        component: PaperChatWindowComponent,
        data: {breadcrumb: 'Chat'},
      },
    ]
  }


];
