// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { I24Support, MessageProgramming } from 'iconsax-react';

// type

// icons
// icons
const icons = {
  maintenance: MessageProgramming,
  contactus: I24Support
};


const examples = {
  id: 'example-group-title',
  title: <FormattedMessage id="example-group-title" />,
  type: 'group',
  children: [
    {
      id: 'List',
      title: <FormattedMessage id="List" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/examples/list'
    },
    {
      id: 'Form',
      title: <FormattedMessage id="Form" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/examples/form'
    },
    {
      id: 'example-basic-list-title',
      title: <FormattedMessage id="example-basic-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/examples/basic-list'
    },
    {
      id: 'example-list-title',
      title: <FormattedMessage id="example-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/examples/example-list'
    },
    {
      id: 'example-form-title',
      title: <FormattedMessage id="example-form-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/examples/example-form'
    }
    // {
    //   id: 'setting-menu-user-title',
    //   title: <FormattedMessage id="setting-menu-user-title" />,
    //   type: 'collapse',
    //   icon: icons.contactus,
    //   children: [
    //     {
    //       id: 'settings-menu-user-list',
    //       title: <FormattedMessage id="settings-menu-user-list" />,
    //       type: 'item',
    //       url: '/settings/user-list'
    //     },
    //     {
    //       id: 'settings-menu-role-list',
    //       title: <FormattedMessage id="settings-menu-role-list" />,
    //       type: 'item',
    //       url: '/settings/role-list'
    //     }
    //   ]
    // }
  ]
};

export default examples;
