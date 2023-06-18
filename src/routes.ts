import PollsPage from './pages/poll/PollsPage';
import {FC} from "react";
import PlayersPage from './pages/players/PlayersPage';
import PollPage from './pages/poll/PollPage';
import GameSchedulePage from 'pages/game_schedule/GameSchedulePage';
import Profile from 'components/Profile';
import PlayerStatPage from 'pages/player_stats/PlayerStatsPage';
import HomePage from 'pages/HomePage';

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
        key: 'home-route',
        title: 'Home',
        path: '/',
        enabled: true,
        navDisplay: false,
        component: HomePage
    },
    {
        key: 'polls-route',
        title: 'Polls',
        path: '/poll',
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
    {
        key: 'player-stats-route',
        title: 'Player Stats',
        path: '/player_stats',
        enabled: true,
        navDisplay: true,
        component: PlayerStatPage
    }, 

]