import React, { Suspense } from 'react';
import '@shopify/polaris/dist/styles.css';
import './App.css';
import {
  Banner,
  Button,
  Layout,
  Page,
  Spinner,
  Stack,
  Tooltip,
} from '@shopify/polaris';
import { Movie, MovieListType, OMDBErrors } from './types';
import MovieList from './MovieList';
import SearchBar from './SearchBar/SearchBar';
import { getMoviesBySearchTerm } from './handlers';

interface IAppState {
  isLoading: boolean,
  searchValue: string,
  movies: Movie[],
  nominations: Movie[],
  errorMessage?: string,
  shareModalOpen: boolean
}

class App extends React.Component<{}, IAppState> {

  readNominationsFromLocalStorage = () => {
    return localStorage.getItem("nominations") ? JSON.parse(localStorage.getItem("nominations") || "") : [];
  }

  updateLocalStorage = () => {
    this.state.nominations.length > 0
      ? localStorage.setItem("nominations", JSON.stringify(this.state.nominations))
      : localStorage.clear()
  }

  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: false,
      searchValue: "",
      movies: [],
      nominations: this.readNominationsFromLocalStorage(),
      errorMessage: "",
      shareModalOpen: false
    }
  }

  handleAddNomination = (nomination: Movie) => {
    let nominations = Array.from(this.state.nominations);
    this.setState({
      nominations: [...nominations, nomination]
    }, this.updateLocalStorage);
  }

  handleRemoveNomination = (nomination: Movie) => {
    let nominations = Array.from(this.state.nominations);
    this.setState({
      nominations: nominations.filter((m: Movie) => { return m.title !== nomination.title })
    }, this.updateLocalStorage);
  }

  checkNominated = (nomination: Movie) => {
    return this.state.nominations.includes(nomination);
  }

  handleSearchValueChange = async (searchValue: string) => {
    this.setState({
      searchValue: searchValue,
      isLoading: true
    });

    if (!searchValue) {
      this.setState({
        movies: [],
        isLoading: false
      });
      return;
    }

    const response = await getMoviesBySearchTerm(searchValue);

    this.setState({
      isLoading: false,
      errorMessage: response.error,
      movies: response.movies
    });
  }

  clear = () => {
    this.setState({
      isLoading: false,
      searchValue: "",
      movies: [],
      nominations: [],
      errorMessage: "",
      shareModalOpen: false
    }, this.updateLocalStorage);
  }

  toggleModal = () => {
    this.setState({
      shareModalOpen: !this.state.shareModalOpen
    });
  }
  
  render() {
    const noNominations = "You haven't nominated any movies yet.";
    const noResults = "Couldn't find any movies with that name. Try with another one.";
    const tooManyResults = "Too many results found with that name. Try being more specific.";
    const emptySearch = "Use the search bar above to find your favorite movies and nominate them.";

    const ShareModal = React.lazy(() => import("./ShareModal/ShareModal"));

    const shareButton = (
      <Button
        primary
        disabled={ this.state.nominations.length < 5 }
        onClick={() => this.setState({ shareModalOpen: true })}
        children={"Share"}
      />
    )

    return (
      <Page
        title="The Shoppies"
        primaryAction={
          <Stack>
            <Button
              disabled={this.state.nominations.length <= 0 && !this.state.searchValue}
              onClick={this.clear}
            >
              Clear
            </Button>
            {
              this.state.nominations.length < 5 &&
              <Tooltip content={<>Before sharing, you must select your <b>five</b> nominations.</>}>
                {shareButton}
              </Tooltip>
            }
            { this.state.nominations.length === 5 && shareButton }
            
          </Stack>
        }
      >
        <Suspense fallback={<Spinner/>}>
          <ShareModal
            open={this.state.shareModalOpen}
            nominations={this.state.nominations}
            toggleModal={this.toggleModal}
          />
        </Suspense>
        <Layout>
          {
            this.state.nominations.length === 5 &&
            <Layout.Section>
              <Banner title="You did it!" status="success" onDismiss={() => {}}>
                <p>You have successfully picked your five nominations for the Shoppies.</p>
              </Banner>
            </Layout.Section>
          }
          
          <Layout.Section>
            <SearchBar
              searchValue={this.state.searchValue}
              onSearchValueChange={this.handleSearchValueChange}
            />
          </Layout.Section>
          <Layout.Section oneHalf>
            <MovieList
              title={!this.state.searchValue? "Results" : `Results for "${this.state.searchValue}"`}
              type={MovieListType.search}
              placeholder={!this.state.searchValue? emptySearch : this.state.errorMessage === OMDBErrors.noResults ? noResults : tooManyResults}
              errorMessage={this.state.errorMessage}
              isLoading={this.state.isLoading}
              movies={this.state.movies}
              onEdit={this.handleAddNomination}
              canEdit={this.state.nominations.length < 5 ? this.checkNominated : () => true}
            />
          </Layout.Section>
          <Layout.Section oneHalf>
          <MovieList
            title="Nominations"
            type={MovieListType.nominations}
            placeholder={noNominations}
            isLoading={this.state.isLoading}
            movies={this.state.nominations}
            onEdit={this.handleRemoveNomination}
          />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default App;
