import PollsPage from './pages/poll/PollsPage';
import {FC} from "react";
import PlayersPage from './pages/players/PlayersPage';
import PollPage from './pages/poll/PollPage';
import GameSchedulePage from 'pages/game_schedule/GameSchedulePage';

interface Route {
    key: string,
    title: string,
    path: string,
    enabled: boolean,
    navDisplay: boolean,
    component: FC<{}>
}

export const routes: Array<Route> = [
    {
        key: 'polls-route',
        title: 'Polls',
        path: '/',
        enabled: true,
        navDisplay: true,
        component: PollsPage
    },
    {
        key: 'poll-route',
        title: 'Poll',
        path: '/poll/:id',
        enabled: true,
        navDisplay: false,
        component: PollPage
    },
    {
        key: 'players-route',
        title: 'Players',
        path: '/players',
        enabled: true,
        navDisplay: true,
        component: PlayersPage
    }, 
    {
        key: 'game-schedule-route',
        title: 'Game Schedule',
        path: '/schedule',
        enabled: true,
        navDisplay: true,
        component: GameSchedulePage
    }, 

]