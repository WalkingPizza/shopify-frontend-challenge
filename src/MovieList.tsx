import React from 'react';
import '@shopify/polaris/dist/styles.css';
import './App.css';
import {
  Card,
  ResourceList,
  ResourceItem,
  Stack,
  TextStyle,
  Caption,
  Button,
} from '@shopify/polaris';
import { ButtonType, Movie, MovieListType } from './types';

interface IMovieListProps {
  title: string,
  type: MovieListType,
  placeholder: string,
  errorMessage?: string,
  movies: Movie[],
  isLoading: boolean,
  readOnly: boolean,
  onEdit: (movie: Movie) => void
  canEdit: (movie: Movie) => boolean
}

export default class MovieList extends React.Component<IMovieListProps> {

  static defaultProps = {
    readOnly: false,
    placeholder: "",
    onEdit: (movie: Movie) => {},
    canEdit: (movie: Movie) => false
  }

  renderIMDbButton = (movie: Movie) => {
    return (
      <Button external url={`https://imdb.com/title/${movie.imdbID}`}>
        View on IMDb
      </Button>
    );
  }

  renderActionButton = (movie: Movie) => {
    const buttonText = this.props.type === MovieListType.nominations ? "Remove" : "Nominate";
    const buttonType = this.props.type === MovieListType.nominations ? ButtonType.destructive : ButtonType.primary;
    const disabled = this.props.canEdit(movie);

    return (
      !this.props.readOnly &&
      <Button
        primary={buttonType === ButtonType.primary}
        destructive={buttonType === ButtonType.destructive}
        disabled={disabled}
        onClick={() => this.props.onEdit(movie)}
      >
        {buttonText}
      </Button>
    );
  }

  renderMovie = (movie: Movie) => {
    const { imdbID, title, year } = movie;

    return (
      <ResourceItem
        id={imdbID}
        onClick={() => {}}
        accessibilityLabel={`${title} (${year})`}
        name={`${title} (${year})`}
        children={
          <Stack vertical>
            <Stack vertical>
              <TextStyle variation="strong">
                {title}
                <Caption>{year}</Caption>
              </TextStyle>
            </Stack>
            <Stack distribution="trailing">
              {this.renderIMDbButton(movie)}
              {this.renderActionButton(movie)}
            </Stack>
          </Stack>
        }
      />
    );
  }

  render() {
    return (
      <Card
        sectioned={this.props.movies.length <= 0}
        title={this.props.title}
      >
        <ResourceList
          emptyState={this.props.placeholder}
          loading={this.props.isLoading}
          items={this.props.movies}
          renderItem={(movie) => this.renderMovie(movie)}
        />
      </Card>
    )
  }
}
