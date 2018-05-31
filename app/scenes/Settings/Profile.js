// @flow
import * as React from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import { color, size } from 'shared/styles/constants';

import AuthStore from 'stores/AuthStore';
import ImageUpload from './components/ImageUpload';
import Input, { LabelText } from 'components/Input';
import Button from 'components/Button';
import CenteredContent from 'components/CenteredContent';
import PageTitle from 'components/PageTitle';
import Flex from 'shared/components/Flex';

type Props = {
  auth: AuthStore,
};

@observer
class Profile extends React.Component<Props> {
  timeout: TimeoutID;

  @observable name: string;
  @observable avatarUrl: ?string;

  componentDidMount() {
    if (this.props.auth.user) {
      this.name = this.props.auth.user.name;
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleSubmit = async (ev: SyntheticEvent<*>) => {
    ev.preventDefault();

    await this.props.auth.updateUser({
      name: this.name,
      avatarUrl: this.avatarUrl,
    });
  };

  handleNameChange = (ev: SyntheticInputEvent<*>) => {
    this.name = ev.target.value;
  };

  handleAvatarUpload = (avatarUrl: string) => {
    this.avatarUrl = avatarUrl;
  };

  handleAvatarError = (error: ?string) => {
    this.props.ui.showToast(error || 'Unable to upload new avatar');
  };

  render() {
    const { user } = this.props.auth;
    if (!user) return null;
    const avatarUrl = this.avatarUrl || user.avatarUrl;

    return (
      <CenteredContent>
        <PageTitle title="Profile" />
        <h1>Profile</h1>
        <ProfilePicture column>
          <LabelText>Picture</LabelText>
          <AvatarContainer>
            <ImageUpload
              onSuccess={this.handleAvatarUpload}
              onError={this.handleAvatarError}
            >
              <Avatar src={avatarUrl} />
              <Flex auto align="center" justify="center">
                Upload new image
              </Flex>
            </ImageUpload>
          </AvatarContainer>
        </ProfilePicture>
        <form onSubmit={this.handleSubmit}>
          <StyledInput
            label="Name"
            value={this.name}
            onChange={this.handleNameChange}
            required
          />
          <Button type="submit" disabled={this.isSaving || !this.name}>
            Save
          </Button>
        </form>
      </CenteredContent>
    );
  }
}

const ProfilePicture = styled(Flex)`
  margin-bottom: ${size.huge};
`;

const avatarStyles = `
  width: 80px;
  height: 80px;
  border-radius: 10px;
`;

const AvatarContainer = styled(Flex)`
  ${avatarStyles};
  position: relative;

  div div {
    ${avatarStyles};
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
    transition: all 250ms;
  }

  &:hover div {
    opacity: 1;
    background: rgba(0, 0, 0, 0.75);
    color: ${color.white};
  }
`;

const Avatar = styled.img`
  ${avatarStyles};
`;

const StyledInput = styled(Input)`
  max-width: 350px;
`;

export default inject('auth', 'ui')(Profile);
