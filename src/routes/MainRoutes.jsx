import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import GeneralSettings from 'pages/settings/general-settings';
import UserList from 'pages/settings/user-settings/user-list';
import RoleList from 'pages/settings/user-settings/role-list';
import ExampleForm from 'pages/examples/example-form';
import ExampleList from 'pages/examples/example-list';
import ExampleBasicList from 'pages/examples/basic-list';
import Default from 'pages/default';
import List from 'pages/examples/list';
import Form from 'pages/examples/form';
import Detail from 'pages/examples/detail';

const ErrorPage = Loadable(lazy(() => import('pages/error-pages/404')));

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/default',
          url: '/default',
          index: true,
          element: <Default />
        },
        {
          path: '/examples',
          children: [
            {
              path: 'list',
              element: <List />
            },
            {
              path: 'form',
              element: <Form />
            },
            {
              path: 'detail/:id',
              element: <Detail />
            },
            {
              path: 'basic-list',
              element: <ExampleBasicList />
            },
            {
              path: 'example-list',
              element: <ExampleList />
            },
            {
              path: 'example-form',
              element: <ExampleForm />
            }
          ]
        },
        {
          path: '/settings',
          children: [
            {
              path: 'general-settings',
              element: <GeneralSettings />
            },
            {
              children: [
                {
                  path: 'user-list',
                  element: <UserList />
                },
                {
                  path: 'role-list',
                  element: <RoleList />
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '*',
      element: <ErrorPage />
    }
  ]
};

export default MainRoutes;
