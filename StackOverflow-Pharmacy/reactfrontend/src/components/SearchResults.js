import React from 'react';
import { useLocation } from 'react-router-dom';

function SearchResults() {
  const location = useLocation();
  const searchResults = location.state && location.state.results;

  return (
    <div>
      <h1>Search Results</h1>
      <div id="searchResults">
        {searchResults && searchResults.length > 0 ? (
          searchResults.map((medicine, index) => (
            <div key={index}>
              <h2>{medicine.name}</h2>
              <p>Description: {medicine.description}</p>
              <p>Price: ${medicine.price}</p>
            </div>
          ))
        ) : (
          <p>No medicines found with the provided name.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
