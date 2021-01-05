import React from 'react';
import '@shopify/polaris/dist/styles.css';
import { Movie } from '../types';
import { Modal, Stack, TextContainer, TextField } from '@shopify/polaris';

interface IShareModalProps {
  nominations: Movie[],
  open: boolean,
  toggleModal: () => void
}

export default class ShareModal extends React.Component<IShareModalProps> {

  nominationsToString = () => {
    return this.props.nominations.map((nomination: Movie) => nomination.imdbID).join();
  }

  render() {
    return(
      <Modal
        open={this.props.open}
        onClose={() => this.props.toggleModal()}
        title="Share your nominations"
      >
        <Modal.Section>
          <Stack vertical>
            <Stack.Item>
              <TextContainer>
                <p>Share your link with your friends to show them which movies you believe should be nominated for the Shoppies!</p>
              </TextContainer>
            </Stack.Item>
            <Stack.Item fill>
              <TextField
                readOnly={true}
                label="Your link"
                value={`${window.location.href}list/${this.nominationsToString()}`}
                onChange={() => {}}
              />
            </Stack.Item>
          </Stack>
        </Modal.Section>
      </Modal>
    );

  }
}