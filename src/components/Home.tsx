import React from "react";
import { useCallback, useState, useRef, useEffect } from "react";
import { useArticle } from "../hooks/UseArticle";
import {Card,CardContent,Typography} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBack from "@mui/icons-material/ArrowBack";

interface IArticle {
  title: string;
  body: string;
  id: string;
}

interface IUseArticle {
  article: IArticle[] | null;
  keyword: string;
  filteredArticles: IArticle[] | null;
  handleFilter: (keyword: string) => void;
}

export const Home: React.FC = () => {
  const { article, keyword, filteredArticles, handleFilter } = useArticle();
  const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);
  const openArticleRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleFilter((e.target as HTMLFormElement).value);
    },
    [handleFilter]
  );

  const handleCardClick = (a: IArticle) => {
    setSelectedArticle(a);
  };

  const handleClick = (e: MouseEvent) => {
    if (
      openArticleRef.current &&
      !openArticleRef.current.contains(e.target as Node)
    ) {
      setSelectedArticle(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const highlightMatchedKeywords = (keyword: string, text: string) => {
    const keywordRegex = new RegExp(keyword, "gi");
    return text.replace(
      keywordRegex,
      (match) => `<span class="highlight">${match}</span>`
    );
  };

  return (
    <main>
      <div className="container">
        <h3>Filtered by keywords</h3>
        <div className="input-container">
          <form>
            <SearchIcon className="icon" />
            <input
              className="input-form"
              type="text"
              value={keyword}
              onChange={(e) => handleFilter(e.target.value)}
            />
          </form>
        </div>
        <hr />
        {selectedArticle ? (
          <div>
            <h2>{selectedArticle.title}</h2>
            <p>{selectedArticle.body}</p>
          </div>
        ) : (
          <div className="articles">
            {filteredArticles
              ? filteredArticles.map((a) => (
                  <Card
                    className="card"
                    key={a.id}
                    onClick={() => handleCardClick(a)}
                  >
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatchedKeywords(keyword, a.title),
                        }}
                      ></Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {a.body.substring(0, 100)}...
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              : article &&
                article.map((a) => (
                  <Card
                    className="card"
                    key={a.id}
                    onClick={() => handleCardClick(a)}
                  >
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {a.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {a.body.substring(0, 100)}...
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
          </div>
        )}
        <div className="back-button">
          <ArrowBack className="arrow"></ArrowBack>
          <button className="button" onClick={() => setSelectedArticle(null)}>
            Back to homepage
          </button>
        </div>
      </div>
    </main>
  );
};
