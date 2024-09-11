class RecintosZoo {
  constructor() {
    this.animais = {
      LEAO: { tamanho: 3, bioma: ["savana"], dieta: "carnivoro" },
      LEOPARDO: { tamanho: 2, bioma: ["savana"], dieta: "carnivoro" },
      CROCODILO: { tamanho: 3, bioma: ["rio"], dieta: "carnivoro" },
      MACACO: { tamanho: 1, bioma: ["savana", "floresta"], dieta: "onivoro" },
      GAZELA: { tamanho: 2, bioma: ["savana"], dieta: "herbivoro" },
      HIPOPOTAMO: { tamanho: 4, bioma: ["savana", "rio"], dieta: "herbivoro" },
    };

    this.recintos = [
      {
        numero: 1,
        bioma: ["savana"],
        tamanhoTotal: 10,
        animais: [{ especie: "MACACO", quantidade: 3 }],
      },
      {
        numero: 2,
        bioma: ["floresta"],
        tamanhoTotal: 5,
        animais: [],
      },
      {
        numero: 3,
        bioma: ["savana", "rio"],
        tamanhoTotal: 7,
        animais: [{ especie: "GAZELA", quantidade: 1 }],
      },
      {
        numero: 4,
        bioma: ["rio"],
        tamanhoTotal: 8,
        animais: [],
      },
      {
        numero: 5,
        bioma: ["savana"],
        tamanhoTotal: 9,
        animais: [{ especie: "LEAO", quantidade: 1 }],
      },
    ];
  }

  analisaRecintos(tipoAnimal, quantidade) {
    const animal = this.animais[tipoAnimal];

    if (!animal) {
      return { erro: "Animal inválido" };
    }

    if (quantidade <= 0 || !Number.isInteger(quantidade)) {
      return { erro: "Quantidade inválida" };
    }

    const recintosViaveis = this.recintos.filter((recinto) => {
      return this.podeAdicionarAnimal(recinto, tipoAnimal, quantidade);
    });

    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    return {
      recintosViaveis: recintosViaveis
        .sort((a, b) => a.numero - b.numero)
        .map((recinto) => {
          const espacoOcupadoAtual = recinto.animais.reduce(
            (soma, a) => soma + this.animais[a.especie].tamanho * a.quantidade,
            0
          );
          const espacoExtra =
            recinto.animais.length > 0 &&
            recinto.animais.some((a) => a.especie !== tipoAnimal)
              ? 1
              : 0;
          const espacoNecessarioNovoAnimal = animal.tamanho * quantidade;
          const espacoRestante =
            recinto.tamanhoTotal -
            (espacoOcupadoAtual + espacoNecessarioNovoAnimal + espacoExtra);

          return `Recinto ${recinto.numero} (espaço livre: ${espacoRestante} total: ${recinto.tamanhoTotal})`;
        }),
    };
  }

  podeAdicionarAnimal(recinto, tipoAnimal, quantidade) {
    const animal = this.animais[tipoAnimal];
    const espacoNecessario = animal.tamanho * quantidade;

    if (!this.verificaCompatibilidadeAnimal(recinto, tipoAnimal, quantidade)) {
      return false;
    }

    if (
      !animal.bioma.some((b) => recinto.bioma.includes(b)) &&
      !(
        recinto.bioma.includes("savana") &&
        recinto.bioma.includes("rio") &&
        animal.bioma.includes("savana") &&
        animal.bioma.includes("rio")
      )
    ) {
      return false;
    }

    const espacoOcupadoAtual = recinto.animais.reduce(
      (soma, a) => soma + this.animais[a.especie].tamanho * a.quantidade,
      0
    );
    const espacoExtra =
      recinto.animais.length > 0 &&
      recinto.animais.some((a) => a.especie !== tipoAnimal)
        ? 1
        : 0;
    const espacoRestante =
      recinto.tamanhoTotal - espacoOcupadoAtual - espacoExtra;

    return espacoNecessario <= espacoRestante;
  }

  verificaCompatibilidadeAnimal(recinto, tipoAnimal, quantidade) {
    const novoAnimal = this.animais[tipoAnimal];

    if (novoAnimal.dieta === "carnivoro") {
      const animaisExistentes = recinto.animais;
      if (
        animaisExistentes.length > 0 &&
        !animaisExistentes.every(
          (a) =>
            this.animais[a.especie].dieta === "carnivoro" &&
            a.especie === tipoAnimal
        )
      ) {
        return false;
      }
    }
    if (tipoAnimal === "MACACO") {
      if (quantidade < 2 && recinto.animais.length === 0) {
        return false;
      }
    }

    if (tipoAnimal === "HIPOPOTAMO") {
      if (
        !(recinto.bioma.includes("savana") && recinto.bioma.includes("rio"))
      ) {
        return false;
      }
    }

    if (
      recinto.animais.some(
        (a) =>
          this.animais[a.especie].dieta === "carnivoro" &&
          tipoAnimal === "MACACO"
      )
    ) {
      return false;
    }

    return true;
  }
}

export { RecintosZoo as RecintosZoo };
