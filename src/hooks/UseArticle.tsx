import { useState, useEffect } from 'react';

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

export const useArticle = (): IUseArticle => {
    const [article, setArticle] = useState<IArticle[] | null>(null);
    const [keyword, setKeyword] = useState("");
    const [filteredArticles, setFilteredArticles] = useState<IArticle[] | null>(null);

    

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/posts/")
        .then((response) => response.json())
        .then((data) => setArticle(data))
        .catch((error) => console.log(error));
    }, []);
    

    useEffect(() => {
        if (!article) return;
        if (!keyword) return setFilteredArticles(null);

        setFilteredArticles(
        article.filter(
            (a) =>
            a.title.toLowerCase().includes(keyword.toLowerCase()) ||
            a.body.toLowerCase().includes(keyword.toLowerCase())
        )
        );
    }, [article, keyword]);

    const handleFilter = (keyword: string) => setKeyword(keyword);

    

    return { article, keyword, filteredArticles, handleFilter };
};



