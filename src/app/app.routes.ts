import {Routes} from '@angular/router';
import {PaperChatWindowComponent} from './modules/chat/components/paper-chat-window/paper-chat-window.component';
import {IntroductionComponent} from './modules/base/components/introduction/introduction.component';
import {
  IntroductionWrapperComponent
} from './modules/base/components/introduction-wrapper/introduction-wrapper.component';
import {FaqComponent} from './modules/base/components/faq/faq.component';
import {
  IntroductionStudiesComponent
} from './modules/base/components/introduction-studies/introduction-studies.component';
import {ChatWelcomeComponent} from './modules/chat/components/chat-welcome/chat-welcome.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'introduction',
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
        path: 'studies',
        component: IntroductionStudiesComponent,
      },
    ],
  },
  {
    path: 'chat',
    component: PaperChatWindowComponent,
    data: {breadcrumb: 'Chat'},
  },
  {
    path: 'chats',
    component: ChatWelcomeComponent,
    data: {breadcrumb: 'Chat'},
  },


];
