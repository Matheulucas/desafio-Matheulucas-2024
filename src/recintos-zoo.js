class RecintosZoo {
  constructor() {
    this.animais = [
      { especie: "LEAO", tamanho: 3, bioma: ["savana"] },
      { especie: "LEOPARDO", tamanho: 2, bioma: ["savana"] },
      { especie: "CROCODILO", tamanho: 3, bioma: ["rio"] },
      { especie: "MACACO", tamanho: 1, bioma: ["savana", "floresta"] },
      { especie: "GAZELA", tamanho: 2, bioma: ["savana"] },
      { especie: "HIPOPOTAMO", tamanho: 4, bioma: ["savana", "rio"] },
    ];
    this.recintos = [
      {
        numero: 1,
        bioma: "savana",
        tamanhoTotal: 10,
        animais: [{ especie: "MACACO", quantidade: 3 }],
      },
      { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: [] },
      {
        numero: 3,
        bioma: "savana e rio",
        tamanhoTotal: 7,
        animais: [{ especie: "GAZELA", quantidade: 1 }],
      },
      { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: [] },
      {
        numero: 5,
        bioma: "savana",
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

    const recintosViaveis = this.recintos.filter((recinto) =>
      this.podeAdicionarAnimal(recinto, tipoAnimal, quantidade)
    );

    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    return {
      recintosViaveis: recintosViaveis.map((recinto) => {
        const espacoOcupado = recinto.animais.reduce(
          (soma, a) => soma + this.animais[a.especie].tamanho * a.quantidade,
          0
        );

        const espacoRestante =
          recinto.tamanhoTotal -
          espacoOcupado -
          (recinto.animais.length > 0 &&
          tipoAnimal !== recinto.animais[0].especie
            ? 1
            : 0);
        return `Recinto ${recinto.numero} (espaço livre: ${espacoRestante} total: ${recinto.tamanhoTotal})`;
      }),
    };
  }
  podeAdicionarAnimal(recinto, tipoAnimal, quantidade) {
    const animal = this.animais[tipoAnimal];
    const espacoNecessario = animal.tamanho * quantidade;
    if (
      !animal.bioma.includes(recinto.bioma) &&
      !(
        recinto.bioma.includes("savana") &&
        recinto.bioma.includes("rio") &&
        tipoAnimal === "HIPOPOTAMO"
      )
    ) {
      return false;
    }

    const espacoOcupado = recinto.animais.reduce(
      (soma, a) => soma + this.animais[a.especie].tamanho * a.quantidade,
      0
    );

    const espacoExtra =
      recinto.animais.length > 0 && tipoAnimal !== recinto.animais[0].especie
        ? 1
        : 0;
    const espacoRestante = recinto.tamanhoTotal - espacoOcupado - espacoExtra;

    if (espacoNecessario > espacoRestante) {
      return false;
    }

    if (
      animal.tamanho >= 3 &&
      recinto.animais.some((a) => a.especie !== tipoAnimal)
    ) {
      return false;
    }

    if (
      tipoAnimal === "MACACO" &&
      quantidade === 1 &&
      recinto.animais.length === 0
    ) {
      return false;
    }

    if (
      tipoAnimal === "HIPOPOTAMO" &&
      recinto.bioma !== "savana e rio" &&
      recinto.animais.length > 0
    ) {
      return false;
    }

    return true;
  }
  verificaConfortoDosAnimais(recinto, tipoAnimal, quantidade) {
    const novoAnimal = this.animais[tipoAnimal];

    if (novoAnimal.carnivoro) {
      const outroAnimalPresente = recinto.animais.some(
        (a) => a.especie !== tipoAnimal
      );

      if (outroAnimalPresente) {
        return false;
      }
    }

    if (
      tipoAnimal === "MACACO" &&
      quantidade === 1 &&
      recinto.animais.length === 0
    ) {
      return false;
    }

    if (
      tipoAnimal === "HIPOPOTAMO" &&
      recinto.bioma !== "savana e rio" &&
      recinto.animais.length > 0
    ) {
      return false;
    }

    for (let a of recinto.animais) {
      const animalPresente = this.animais[a.especie];

      if (animalPresente.carnivoro && tipoAnimal !== a.especie) {
        return false;
      }

      if (
        a.especie === "MACACO" &&
        a.quantidade === 1 &&
        quantidade === 1 &&
        tipoAnimal !== "MACACO"
      ) {
        return false;
      }

      if (
        recinto.animais.length > 1 &&
        a.especie !== tipoAnimal &&
        recinto.tamanhoTotal <
          a.quantidade * animalPresente.tamanho +
            quantidade * novoAnimal.tamanho +
            1
      ) {
        return false;
      }
    }

    return true;
  }
}

export { RecintosZoo as RecintosZoo };
