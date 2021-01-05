import React from 'react';
import '@shopify/polaris/dist/styles.css';
import {
  Card,
  Icon,
  TextField,
} from '@shopify/polaris';
import {SearchMinor} from '@shopify/polaris-icons';

interface ISearchBarProps {
  searchValue?: string,
  onSearchValueChange: (searchValue: string) => void,
}

export default class SearchBar extends React.Component<ISearchBarProps> {

  static defaultProps = {
    searchValue: ""
  }

  render() {
    return (
      <Card sectioned>
        <TextField
          label="Movie title"
          placeholder="Search your movie here"
          onChange={this.props.onSearchValueChange}
          value={this.props.searchValue}
          prefix={
            <Icon source={SearchMinor} color="inkLighter" />
          }
        />
      </Card>
    );
  }
}